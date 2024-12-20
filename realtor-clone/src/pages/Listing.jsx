import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import {
	FaParking,
	FaShare,
	FaMapMarkerAlt,
	FaBed,
	FaBath,
    FaChair,
} from "react-icons/fa";
import { TbCurrencyDollarOff } from "react-icons/tb";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
    const auth = getAuth();
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);

	useEffect(() => {
		async function fetchListing() {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		}
		fetchListing();
	}, [params.listingId]);
	if (loading) {
		return <Spinner />;
	}
	return (
		<main className="relative">
			<Swiper
				modules={[Navigation, EffectFade, Pagination, Autoplay]}
				slidesPerView={1}
				navigation
				pagination={{ type: "progressbar" }}
				effect="fade"
				autoplay={{ delay: 3000 }}
			>
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<div
							className="relative w-full overflow-hidden h-[300px]"
							style={{
								background: `url(${listing.imgUrls[index]}) center no-repeat`,
								backgroundSize: "cover",
							}}
						></div>
					</SwiperSlide>
				))}
			</Swiper>
			<div
				className="absolute items-center justify-center top-[20px] right-[20px] z-10 flex cursor-pointer bg-white w-10 h-10 border-gray-400 rounded-full"
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}
			>
				<FaShare className="text-lg text-red-500" />
			</div>
			{shareLinkCopied && (
				<p className="absolute top-[20px] right-[70px] border border-slate-600 text-gray-500 rounded-md bg-white z-10 p-2">
					Link Copied
				</p>
			)}
			<div className="m-4 p-4 flex flex-col max-w-6xl bg-white rounded-lg shadow-lg lg:mx-auto lg:space-x-5 md:flex-row ">
				<div className="w-full mr-2">
					<p className="text-2xl font-bold mb-3 text-blue-900">
						{listing.name} - $
						{listing.offer
							? (+listing.regularPrice - +listing.discountedPrice)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" ? " / month" : ""}
					</p>
					<p className="flex items-center mt-6 mb-3 font-semibold">
						<FaMapMarkerAlt className="text-green-700 mr-1" />
						{listing.address}
					</p>
					<div className="flex justify-start items-center space-x-4 w-[75%]">
						<p className="bg-red-700 w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md text-white">
							{listing.type === "rent" ? "Rent" : "Sale"}
						</p>
						{listing.offer && (
							<p className="flex items-center justify-center w-full bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
								<TbCurrencyDollarOff />
								{listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
							</p>
						)}
					</div>
					<p className="my-3">
						<span className="font-semibold">Description</span> -{" "}
						{listing.description}
					</p>
					<ul className="grid grid-cols-2 grid-rows-2 grid-flow-row gap-4 text-sm font-semibold mb-6 | md:flex md:items-center md:space-x-2 | lg:space-x-10">
						<li className="flex | md:items-center md:whitespace-nowrap">
							<FaBed className="text-lg mr-1" />
							{+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
						</li>
						<li className="flex | md:items-center md:whitespace-nowrap">
							<FaBath className="text-lg mr-1" />
							{+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
						</li>
						<li className="flex | md:items-center md:whitespace-nowrap">
							<FaParking className="text-lg mr-1" />
							{+listing.parking ? "Parking" : "No Parking"}
						</li>
						<li className="flex | md:items-center md:whitespace-nowrap">
							<FaChair className="text-lg mr-1" />
							{+listing.furnished ? "Furnished" : "Not Furnished"}
						</li>
					</ul>
					{listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
						<div className="mt-6">
							<button
								className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
								onClick={() => setContactLandlord(true)}
							>
								Contact Landlord
							</button>
						</div>
					)}
					{contactLandlord && (
						<Contact userRef={listing.userRef} listing={listing} />
					)}
				</div>
				<div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
					<MapContainer
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "100%", width: "100%" }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[listing.geolocation.lat, listing.geolocation.lng]}
						>
							<Popup>
								<p className="font-semibold pr-1">
									{listing.name} <span className="text-blue-900">
										$
										{listing.regularPrice
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</p>
								<p>{listing.address}</p>
							</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</main>
	);
}
