import NeedHelpMap from "./NeedHelpMap.jsx";

export default function BrowseMapView({ requests }) {
  return (
    <NeedHelpMap
      requests={requests}
      mode="browse"
      heightClass="h-[40rem]"
      centerLabel="Interactive map showing nearby requests with subtle movement and live visual clustering."
    />
  );
}
