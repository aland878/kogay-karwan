#!/usr/bin/env python3
"""
Import the Kogay Karwan product sheet into the app's catalog JSON.

    python3 scripts/import-catalog.py <workbook.xlsx>

Source columns (Kurdish headers, row 2):
    A  #                 running index
    B  (unlabelled)      product name  — Kurdish, the authoritative name
    C  ژمارەی کارتۆن      units per carton
    D  نرخى بة بارجة      unit price (IQD)
    E  نرخ بة كارتون      carton price (IQD) — present on a minority of rows
    F  جۆری بابەت         category

Two things the sheet encodes that need care:

1.  The price column doubles as a stock flag. Where a buyer wrote "نیتمان"
    ("we don't have it") or "نەماوە" ("none left") instead of a number, the
    product is real but unavailable. Those rows are imported as out-of-stock
    rather than dropped, because the business still sells them.

2.  Where a carton price exists it is a BULK price, cheaper per unit than the
    single-unit price. That gap is the real, monetary, per-unit discount, so it
    is imported as one instead of being invented.

Stock counts are NOT in the sheet, so none are fabricated: products carry
`stockTracked: false`, meaning "available, exact count unknown".
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

# --- Stock markers written into the price column ---------------------------
OUT_OF_STOCK_MARKERS = {
    "نیتمان", "نيتمان",   # "we don't have it"
    "نەماوە", "نةماوة",   # "none left"
}

# --- Kurdish orthography ---------------------------------------------------
# The sheet is typed on an Arabic keyboard, the usual convention in Iraq. These
# four substitutions map it onto proper Kurdish Sorani letters. Only these four
# are applied: they are unambiguous, and guessing further would corrupt names.
ARABIC_TO_KURDISH = {
    "ك": "ک",   # Arabic kaf      -> Kurdish kaf
    "ي": "ی",   # Arabic yeh      -> Farsi yeh
    "ى": "ی",   # alef maksura    -> Farsi yeh
    "ة": "ە",   # teh marbuta     -> Kurdish ae
}

# Sorani -> Latin, for URL slugs only. Never shown to a reader.
TRANSLITERATION = {
    "ا": "a", "آ": "a", "ب": "b", "پ": "p", "ت": "t", "ث": "s", "ج": "j",
    "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ذ": "z", "ر": "r", "ڕ": "r",
    "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s", "ض": "z", "ط": "t",
    "ظ": "z", "ع": "", "غ": "gh", "ف": "f", "ڤ": "v", "ق": "q", "ک": "k",
    "گ": "g", "ل": "l", "ڵ": "l", "م": "m", "ن": "n", "و": "w", "ۆ": "o",
    "وو": "u", "ه": "h", "ە": "e", "ی": "i", "ێ": "e", "ئ": "", "ء": "",
    "أ": "a", "إ": "i", "ؤ": "u", "لا": "la", "ﻻ": "la",
}


def to_kurdish(text: str) -> str:
    """Normalise Arabic-keyboard spelling to Kurdish Sorani letters."""
    for arabic, kurdish in ARABIC_TO_KURDISH.items():
        text = text.replace(arabic, kurdish)
    return text


def slugify(text: str, fallback: str) -> str:
    """URL-safe slug. Transliterates Kurdish script; falls back on the index."""
    text = to_kurdish(text)
    out = []
    for char in text:
        if char in TRANSLITERATION:
            out.append(TRANSLITERATION[char])
        elif char.isascii() and (char.isalnum()):
            out.append(char.lower())
        elif char.isdigit():
            out.append(char)
        elif char in " \t-_/+.،":
            out.append("-")
        # Anything else (diacritics, punctuation) is dropped.

    slug = "".join(out)
    slug = unicodedata.normalize("NFKD", slug).encode("ascii", "ignore").decode()
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    slug = re.sub(r"[^a-z0-9-]", "", slug.lower())

    return slug or fallback


def as_int(value) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return int(round(value))
    return None


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    source = Path(sys.argv[1])
    repo = Path(__file__).resolve().parent.parent
    out_path = repo / "src" / "lib" / "data" / "seed" / "catalog.json"

    worksheet = openpyxl.load_workbook(source, read_only=True, data_only=True)["Sheet1"]
    rows = list(worksheet.iter_rows(min_row=3, values_only=True))

    categories: dict[str, dict] = {}
    products: list[dict] = []
    used_slugs: set[str] = set()
    used_sequences: set[int] = set()
    # Reserved block for rows the sheet left un-numbered.
    next_spare = 90001

    stats = {
        "rows": 0,
        "out_of_stock": 0,
        "no_price": 0,
        "discounted": 0,
        "no_case_qty": 0,
        "reindexed": 0,
    }

    for row in rows:
        index, name, case_qty, unit_price, carton_price, category = (
            row + (None,) * 6
        )[:6]

        if not name or not str(name).strip():
            continue  # pre-numbered but empty row

        stats["rows"] += 1

        # The sheet's own "#" is the business's identifier, so it becomes the
        # SKU and survives re-imports. A handful of rows have no number; those
        # are assigned from a reserved high block rather than from the running
        # row count, which would collide with a real index further down.
        seq = as_int(index)
        if seq is None or seq in used_sequences:
            stats["reindexed"] += 1
            seq = next_spare
            while seq in used_sequences:
                seq += 1
            next_spare = seq + 1
        used_sequences.add(seq)

        raw_name = str(name).strip()
        kurdish_name = to_kurdish(raw_name)

        # --- Category ------------------------------------------------------
        raw_category = str(category).strip() if category else "بێ پۆل"
        kurdish_category = to_kurdish(raw_category)

        if kurdish_category not in categories:
            category_slug = slugify(kurdish_category, f"cat-{len(categories) + 1}")
            base_slug = category_slug
            suffix = 2
            while any(c["slug"] == category_slug for c in categories.values()):
                category_slug = f"{base_slug}-{suffix}"
                suffix += 1

            categories[kurdish_category] = {
                "id": f"c-{len(categories) + 1}",
                "slug": category_slug,
                # Kurdish is the authoritative name. `en` carries the original
                # as-typed spelling so both spellings stay searchable.
                "name": {"ku": kurdish_category, "en": raw_category, "ar": raw_category},
                "parentId": None,
                "sortOrder": 0,
                "active": True,
            }

        category_id = categories[kurdish_category]["id"]

        # --- Price and stock ----------------------------------------------
        price = as_int(unit_price)
        marker = str(unit_price).strip() if unit_price is not None else ""
        out_of_stock = marker in OUT_OF_STOCK_MARKERS

        if price is None:
            # No usable number: either an explicit stock marker, or blank.
            if out_of_stock:
                stats["out_of_stock"] += 1
            else:
                stats["no_price"] += 1
            price = 0

        case = as_int(case_qty)
        if case is None:
            stats["no_case_qty"] += 1

        # --- Bulk discount --------------------------------------------------
        discount = None
        carton = as_int(carton_price)
        if carton and case and case > 0 and price > 0:
            per_unit = round(carton / case)
            if 0 < per_unit < price:
                discount = price - per_unit
                stats["discounted"] += 1

        # --- Slug -----------------------------------------------------------
        slug = slugify(kurdish_name, f"product-{seq}")
        if slug in used_slugs:
            slug = f"{slug}-{seq}"
        used_slugs.add(slug)

        available = price > 0 and not out_of_stock

        products.append(
            {
                "id": f"p-{seq}",
                "sku": f"KG-{seq:05d}",
                "slug": slug,
                "name": {"ku": kurdish_name, "en": raw_name, "ar": raw_name},
                "brandId": None,
                "categoryId": category_id,
                "subcategoryId": None,
                "image": None,
                "gallery": [],
                "wholesalePrice": {"amount": price, "currency": "IQD"},
                "discount": (
                    {"amount": discount, "currency": "IQD"} if discount else None
                ),
                # No stock counts exist in the source, so none are invented.
                "stockTracked": False,
                "stockQuantity": 0 if not available else 1,
                "lowStockThreshold": 0,
                "unit": "carton" if case and case > 1 else "piece",
                **({"unitsPerCase": case} if case and case > 1 else {}),
                "featured": False,
                "active": True,
            }
        )

    # Categories ordered by catalog size, so the biggest lead the menus.
    counts: dict[str, int] = {}
    for product in products:
        counts[product["categoryId"]] = counts.get(product["categoryId"], 0) + 1

    ordered = sorted(
        categories.values(), key=lambda c: -counts.get(c["id"], 0)
    )
    for position, category in enumerate(ordered, start=1):
        category["sortOrder"] = position

    payload = {
        "source": source.name,
        "productCount": len(products),
        "categoryCount": len(ordered),
        "currency": "IQD",
        "categories": ordered,
        "products": products,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    print(f"Wrote {out_path.relative_to(repo)}")
    print(f"  products          {len(products)}")
    print(f"  categories        {len(ordered)}")
    print(f"  out of stock      {stats['out_of_stock']} (explicit marker)")
    print(f"  missing price     {stats['no_price']}")
    print(f"  bulk discounts    {stats['discounted']}")
    print(f"  no carton qty     {stats['no_case_qty']}")
    print(f"  re-indexed        {stats['reindexed']} (duplicate sheet index)")
    print(f"  size              {out_path.stat().st_size / 1024:.0f} KB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
