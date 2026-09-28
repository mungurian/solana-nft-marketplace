import { ListingCardView } from "@/components/listing-card-view";
import { LISTINGS_GRID_CLASSNAME } from "@/lib/ui";

const SKELETON_COUNT = 6;

export default function Loading() {
  return (
    <div className={LISTINGS_GRID_CLASSNAME}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ListingCardView key={index} />
      ))}
    </div>
  );
}
