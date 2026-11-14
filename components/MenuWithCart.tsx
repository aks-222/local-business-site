"use client";

import MenuItemCard from "./MenuItemCard";

import { business } from "@/config/business";

import { useState } from "react";

import { FaWhatsapp, FaChevronLeft } from "react-icons/fa6";

export default function MenuWithCart() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string>(business.menu[0].id);
  const [isOpen, setIsOpen] = useState(false);

  const allItems = business.menu.flatMap((m) => m.items);

  const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalPrice = allItems.reduce(
    (sum, item) => sum + item.price * (cart[item.id] ?? 0),
    0,
  );

  const orderedItems = allItems.filter((item) => (cart[item.id] ?? 0) > 0);

  const orderLines = orderedItems.map(
    (item) => `- ${item.name} x ${cart[item.id]}`,
  );

  const message = `عايز أطلب:\n${orderLines.join("\n")}\nالإجمالي: ${totalPrice} ${business.currency}`;

  const addItem = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  const removeItem = (id: string) =>
    setCart((prev) => {
      const qty = prev[id] ?? 0;
      if (qty <= 1) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty - 1 };
    });

  const clearCart = () => setCart({});

  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

  const selectedCategory = business.menu.find((m) => m.id === selectedId);

  return (
    <>
      <main id="menu" className="mx-auto w-full max-w-2xl px-4 pb-24 mt-4">
        <div className="flex gap-2 overflow-x-auto py-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {business.menu.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`whitespace-nowrap rounded-full border border-primary px-4 py-1.5 font-semibold transition duration-300 active:scale-95 ${
                m.id === selectedId
                  ? "bg-primary text-[#1c1410] shadow-[0_0_16px_rgba(200,119,62,0.45)]"
                  : "text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(200,119,62,0.3)]"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <section>
          <h2 className="text-center text-accent font-display mt-12 mb-6 text-2xl">
            {selectedCategory?.name}
          </h2>
          {selectedCategory?.items.map((i) => (
            <MenuItemCard onAdd={addItem} key={i.id} item={i} />
          ))}
        </section>
      </main>
      {totalCount > 0 && (
        <div className=" fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-2 border-t border-white/20 bg-[#1c1410] p-2">
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="text-start font-semibold text-accent flex items-center gap-2 border border-white/30 rounded-full px-3 py-1 text-sm active:scale-95 "
          >
            <FaChevronLeft className="size-4" />
            طلبك ({totalCount}) — {totalPrice} {business.currency}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className=" flex items-center gap-2 text-sm shrink-0 rounded-full bg-primary px-3 py-2 font-bold text-[#1c1410] transition hover:opacity-90 active:scale-95 "
          >
            <FaWhatsapp className="size-5 " />
            أرسل الطلب
          </a>
        </div>
      )}
      {isOpen && totalCount > 0 && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-60 bg-black/60"
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[#1c1410] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-accent font-display">طلبك</h3>
              <button
                type="button"
                className="font-semibold text-accent"
                onClick={() => setIsOpen(false)}
              >
                إغلاق
              </button>
            </div>
            {orderedItems.map((i) => (
              <div
                className="flex items-center justify-between mt-4"
                key={i.id}
              >
                <p>
                  {i.name} — {i.price * cart[i.id]} {business.currency}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(i.id);
                      if (totalCount === 1) {
                        setIsOpen(false);
                      }
                    }}
                    className="size-8 rounded-full border border-primary text-primary active:scale-95 hover:bg-primary/5  hover:shadow-[0_0_12px_rgba(200,119,62,0.3)]"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center font-bold text-accent">
                    {cart[i.id]}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem(i.id)}
                    className="size-8 rounded-full border border-primary text-primary active:scale-95 hover:bg-primary/5 hover:shadow-[0_0_12px_rgba(200,119,62,0.3)]"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="flex items-center justify-between font-bold text-accent">
                <span>الإجمالي</span>
                <span>
                  {totalPrice} {business.currency}
                </span>
              </p>
              <div className="flex gap-3 mt-4 ">
                <button
                  className="flex-1 justify-center rounded-full border border-white/30 px-4 py-2 active:scale-95 bg-red-900 hover:bg-red-950 "
                  type="button"
                  onClick={() => {
                    clearCart();
                    setIsOpen(false);
                  }}
                >
                  مسح الكل
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 justify-center   flex items-center gap-2  rounded-full bg-primary px-4 py-2 font-bold text-[#1c1410] transition hover:opacity-90 active:scale-95 "
                >
                  <FaWhatsapp className="size-5 " />
                  أرسل الطلب
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
