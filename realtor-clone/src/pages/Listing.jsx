import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
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
import {  } from "react-icons/fa";

export default function Listing() {
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
				className="fixed items-center justify-center top-[13%] right-[3%] z-10 flex cursor-pointer bg-white w-10 h-10 border-gray-400 rounded-full"
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
				<p className="fixed top-[23%] right-[5%] border border-slate-600 text-gray-500 rounded-md bg-white z-10 p-2">
					Link Copied
				</p>
			)}
			<div className="m-4 p-4 flex flex-col max-w-6xl bg-white rounded-lg shadow-lg lg:mx-auto lg:space-x-5 md:flex-row ">
				<div className="w-full h-[200px] lg:h-[400px]">
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
							<p className="w-full bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
								$
								{listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
								discount
							</p>
						)}
					</div>
					<p className="my-3">
						<span className="font-semibold">Description</span> -{" "}
						{listing.description}
					</p>
					<ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold">
						<li className="flex items-center whitespace-nowrap">
							<FaBed className="text-lg mr-1" />
							{+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaBath className="text-lg mr-1" />
							{+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaParking className="text-lg mr-1" />
							{+listing.parking ? "Parking" : "No Parking"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaChair className="text-lg mr-1" />
							{+listing.furnished ? "Furnished" : "Not Furnished"}
						</li>
                    </ul>
				</div>
				<div className="bg-blue-300 w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden"></div>
			</div>
		</main>
	);
}
