import Image from "next/image";
import styles from "./ImageCard.module.css";

type ImageCardProps = {
  src: string; // e.g. "/crypto_img_1.png"
  alt?: string;
  width?: number; // optional: keep ratio
  height?: number; // optional: keep ratio
  priority?: boolean;
};

export default function ImageCard({
  src,
  alt = "card image",
  width = 900,
  height = 1600,
  priority = false,
}: ImageCardProps) {
  return (
    <div className={styles.card}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={styles.img}
      />
    </div>
  );
}
