"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import type { RtSummaryRow } from "./village-map-section";

function markerIcon(rtId: number, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:9999px;
      background:${active ? "#004617" : "#FFFFFF"};
      color:${active ? "#FFFFFF" : "#004617"};
      border:2px solid #004617;
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
      font:800 12px Manrope,sans-serif;
    ">${rtId}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export function VillageMapLeaflet({
  rtList,
  selected,
  onSelect,
}: {
  rtList: RtSummaryRow[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}) {
  const center: [number, number] = [-8.0057, 110.6753];

  return (
    <MapContainer
      center={center}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rtList.map((rt) => (
        <Marker
          key={rt.rt_id}
          position={[rt.latitude, rt.longitude]}
          icon={markerIcon(rt.rt_id, selected === rt.rt_id)}
          eventHandlers={{ click: () => onSelect(selected === rt.rt_id ? null : rt.rt_id) }}
        />
      ))}
    </MapContainer>
  );
}
