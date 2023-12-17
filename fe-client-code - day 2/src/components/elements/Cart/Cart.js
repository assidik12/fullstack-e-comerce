import React, { useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import { useCart, useCartDispatch } from "@/context/CartContext";
import api from "@/api";

const Cart = () => {
  const [payAmount, setPayAmount] = useState();
  const carts = useCart();
  const dispatch = useCartDispatch();
  const [Token, setToken] = useState("");

  const handleAddToCart = (Cart) => {
    dispatch({
      type: "add",
      payload: Cart,
    });
  };
  const handleDecreaseCart = (Cart) => {
    dispatch({
      type: "decrease",
      payload: Cart,
    });
  };
  const getTotalPrice = () => {
    let totalPrice = 0;
    for (let i = 0; i < carts.length; i++) {
      totalPrice += carts[i].price * carts[i].quantity;
    }
    return totalPrice;
  };
  const handleChangePay = (event) => {
    const { target } = event;
    const { value } = target;
    setPayAmount(value);
  };

  const handleChekout = async () => {
    const products = carts.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    });
    try {
      const payload = {
        total_price: +getTotalPrice(),
        paid_amount: parseInt(payAmount),
        products,
      };
      await api.post("/transactions", payload);

      async function fetchLastProducts() {
        const script = document.createElement("script");
        const snapscript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_CLIENT;
        script.src = snapscript;
        script.setAttribute("data-client-key", clientKey);
        document.body.appendChild(script);
        script.async = true;

        const response = await api.get("/transactions");
        setToken(response.data.message.token);
        window.snap.pay(Token, {
          onSuccess: function (result) {
            console.log(result);
          },
          onPending: function (result) {
            console.log(result);
          },
          onError: function (result) {
            console.log(result);
          },
          onClose: function () {
            console.log("customer closed the popup without finishing the payment");
          },
        });
        if (Token) {
          setToken();
        }

        dispatch({ type: "clear" });
        window.location.reload();
        return () => {
          document.body.removeChild(script);
        };
      }
      return fetchLastProducts();
    } catch {
      throw Error("Something went wrong");
    }
  };

  const isDisableButton = () => {
    return !payAmount || +payAmount < +getTotalPrice() || carts.length === 0;
  };

  return (
    <div className={styles.cart}>
      <h3>Cart</h3>
      <div className={styles["cart__cart-list"]}>
        {carts.map((cart, index) => {
          return (
            <div key={index} className={styles["cart-item"]}>
              <div className={styles["cart-item__image"]}>
                <Image src={cart.img_product} alt={cart.name} fill style={{ objectFit: "contain" }} />
              </div>
              <div className={styles["cart-item__desc"]}>
                <p>{cart.name}</p>
                <p>{cart.price}</p>
              </div>
              <div className={styles["cart-item__action"]}>
                <button onClick={() => handleDecreaseCart(cart)}>-</button>
                <p>{cart.quantity}</p>
                <button onClick={() => handleAddToCart(cart)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles["cart__chekout"]}>
        <div className={styles["cart__total-price"]}>
          <p>total harga</p>
          <p>{getTotalPrice()}</p>
        </div>
        <div className={styles["cart__pay"]}>
          <label>bayar</label>
          <input placeholder="-" onChange={handleChangePay} type="number" />
        </div>
        <button onClick={handleChekout} disabled={isDisableButton()}>
          Chekout
        </button>
      </div>
    </div>
  );
};

export default Cart;
