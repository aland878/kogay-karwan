import type { OrderRepository } from "@/lib/data/repositories";
import type { Order, OrderStatus, Paginated } from "@/lib/domain/types";
import { ORDER_NUMBER_PREFIX, allowedTransitions } from "@/lib/domain/types";

/**
 * IN-MEMORY ORDER ADAPTER
 *
 * Order numbers come from a monotonic counter seeded above the demo rows.
 * In Postgres this becomes a sequence — the property that matters either way is
 * that a number is never reused, because it ends up printed on an invoice.
 */

const orders: Order[] = [];
let orderCounter = 10481;

function nextOrderNumber(): string {
  orderCounter += 1;
  return `${ORDER_NUMBER_PREFIX}${orderCounter}`;
}

export class MockOrderRepository implements OrderRepository {
  async listOrders(
    options: {
      customerId?: string;
      status?: OrderStatus;
      assignedEmployeeId?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ): Promise<Paginated<Order>> {
    let result = [...orders];

    if (options.customerId) {
      result = result.filter((order) => order.customerId === options.customerId);
    }
    if (options.status) {
      result = result.filter((order) => order.status === options.status);
    }
    if (options.assignedEmployeeId) {
      result = result.filter(
        (order) => order.assignedEmployeeId === options.assignedEmployeeId,
      );
    }
    if (options.search) {
      const needle = options.search.trim().toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(needle) ||
          order.customerName.toLowerCase().includes(needle) ||
          order.customerPhone.includes(needle),
      );
    }

    result.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    const pageSize = Math.max(1, Math.min(options.pageSize ?? 20, 200));
    const pageCount = Math.max(1, Math.ceil(result.length / pageSize));
    const page = Math.min(Math.max(1, options.page ?? 1), pageCount);
    const start = (page - 1) * pageSize;

    return {
      items: result.slice(start, start + pageSize),
      total: result.length,
      page,
      pageSize,
      pageCount,
    };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return orders.find((order) => order.id === id) ?? null;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const needle = orderNumber.trim().toUpperCase();
    return orders.find((order) => order.orderNumber.toUpperCase() === needle) ?? null;
  }

  async createOrder(
    input: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "history">,
  ): Promise<Order> {
    const timestamp = new Date().toISOString();
    const order: Order = {
      ...input,
      id: `o-${Math.random().toString(36).slice(2, 10)}`,
      orderNumber: nextOrderNumber(),
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [{ status: input.status, at: timestamp }],
    };
    orders.unshift(order);
    return order;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    actor: { id: string; name: string },
    reason?: string,
  ): Promise<Order> {
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    const current = orders[index];

    // Enforced here, not in the UI. A status must not skip the flow, and a
    // terminal order must not be reopened — the same check the SQL adapter runs.
    if (!allowedTransitions(current.status).includes(status)) {
      throw new Error(
        `Illegal transition: ${current.status} -> ${status} on ${current.orderNumber}`,
      );
    }

    const timestamp = new Date().toISOString();
    const updated: Order = {
      ...current,
      status,
      statusReason: reason ?? current.statusReason,
      updatedAt: timestamp,
      history: [
        ...current.history,
        { status, at: timestamp, byId: actor.id, byName: actor.name, reason },
      ],
    };

    orders[index] = updated;
    return updated;
  }

  async assignOrder(id: string, employeeId: string): Promise<Order> {
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);
    orders[index] = {
      ...orders[index],
      assignedEmployeeId: employeeId,
      updatedAt: new Date().toISOString(),
    };
    return orders[index];
  }
}
