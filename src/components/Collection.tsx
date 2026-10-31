"use client";

import Image from "next/image";
import type { SyntheticEvent } from "react";
import styles from "./Collection.module.css";
import strawberry from "../../public/fruits/strawberry.png";
import pear from "../../public/fruits/pear.png";
import grapefruit from "../../public/fruits/grapefruit.png";
import orange from "../../public/fruits/orange.png";
import blueberry from "../../public/fruits/blueberry.png";

const portraits = [
  { name: "Strawberry", src: strawberry, note: "Small fruit. Big personality.", color: "pink" },
  { name: "Pear", src: pear, note: "Perfectly ripe for a good time.", color: "yellow" },
  { name: "Grapefruit", src: grapefruit, note: "A bright side of the bunch.", color: "peach" },
] as const;
const decorations = [orange, blueberry, blueberry];
function show({ currentTarget }: SyntheticEvent<HTMLImageElement>) { currentTarget.style.visibility = ""; }
function hide({ currentTarget }: SyntheticEvent<HTMLImageElement>) { currentTarget.style.visibility = "hidden"; }

export default function Collection() {
  return (
    <section className={styles.collection} aria-labelledby="collection-title">
      <div className={styles.stage} data-collection-stage>
        <header className={styles.heading} data-collection-heading>
          <p className={styles.eyebrow}>FRESH FACES / GOOD ENERGY</p>
          <h2 id="collection-title">Meet the fresh bunch.</h2>
          <p>A little different. A lot to love.</p>
        </header>
        <div className={styles.gallery} data-collection-gallery>
          {portraits.map(({ name, src, note, color }, index) => (
            <div className={styles.card} data-collection-card key={name}>
              <div data-card-wave>
              <figure className={styles.frame}>
                <div className={`${styles.portrait} ${styles[color]}`}>
                  <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                  <Image src={src} alt="" width={1280} height={1280} sizes="(max-width: 900px) 75vw, 28vw" loading="lazy" draggable={false} data-collection-image onLoad={show} onError={hide} />
                  <span className={styles.star} aria-hidden="true">✦</span>
                </div>
                <figcaption><h3>{name}</h3><p>{note}</p></figcaption>
              </figure>
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className={styles.decorations}>
          {decorations.map((src, index) => (
            <div key={index} className={styles[`decoration${index}`]} data-collection-orange-anchor={index === 0 ? "" : undefined}><div data-collection-depth>
              <Image src={src} alt="" width={1280} height={1280} sizes={index === 0 ? "45vw" : "12vw"} loading="lazy" draggable={false} data-collection-image onLoad={show} onError={hide} />
            </div></div>
          ))}
        </div>
        <p className={styles.signoff} data-collection-signoff>GROWN TO MAKE YOU SMILE <span aria-hidden="true">✦</span></p>
      </div>
    </section>
  );
}
