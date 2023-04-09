import styles from "@/styles/loading-dots.module.css"

interface LoadingDotsProps {
  color?: string
  size?: "sm" | "lg"
}

const LoadingDots = ({ color = "#f9fafb", size = "lg" }: LoadingDotsProps) => {
  return (
    <span className={size === "sm" ? styles.small : styles.large}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  )
}

export default LoadingDots
