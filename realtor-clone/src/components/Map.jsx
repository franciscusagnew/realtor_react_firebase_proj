import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map(props) {
  return (
		<MapContainer
			center={[props.lat, props.lng]}
			zoom={13}
			scrollWheelZoom={false}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[props.lat, props.lng]}>
				<Popup>
					<p className="font-semibold pr-1">
						{props.name}{" "}
						<span className="text-blue-900">
							$
							{props.regularPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</span>
					</p>
					<p>{props.address}</p>
				</Popup>
			</Marker>
		</MapContainer>
	);
}
