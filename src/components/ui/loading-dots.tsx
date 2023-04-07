import styles from "@/styles/loading-dots.module.css"

const LoadingDots = ({
  color = "#f9fafb",
  size = "lg",
}: {
  color: string
  size: "sm" | "lg"
}) => {
  return (
    <span className={size === "sm" ? styles.small : styles.large}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  )
}

export default LoadingDots
