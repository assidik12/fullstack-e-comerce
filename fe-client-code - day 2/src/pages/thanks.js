import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

const PageThanks = () => {
  return (
    <div className={styles.container}>
      <h3 className="text-center">Terimakasih telah melakukan pembayaran</h3>
      <Link href="/" className="text-center">
        Kembali
      </Link>
    </div>
  );
};

export default PageThanks;
