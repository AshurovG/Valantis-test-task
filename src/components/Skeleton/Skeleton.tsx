import clsx from "clsx"
import ContentLoader from "react-content-loader"
import styles from "./Skeleton.module.scss"

type SkeletonProps = {
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={clsx(styles.skeleton__wrapper, className)}>
    <ContentLoader
      speed={2}
      viewBox="0 0 400 200"
      backgroundColor="#bdbdbd"
      foregroundColor="#ecebeb"
      className={styles.skeleton}
    >
      <rect x="1" y="9" rx="10" ry="10" width="400" height="200" />
    </ContentLoader>
 </div>
)

export default Skeleton
