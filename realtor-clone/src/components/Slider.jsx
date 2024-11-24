import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

export default function Slider() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchLisitings() {
			const listingsRef = collection(db, "listings");
			const q = query(listingsRef, orderBy("timestamp", "desc"), limit(4));
			const querySnap = await getDocs(q);
			let listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listings);
			// console.log(listings);
			setLoading(false);
		}
		fetchLisitings();
	}, []);
	if (loading) {
		return <Spinner />;
	}
	if (listings.length === 0) {
		return <></>;
	}
	return (
		listings && (
			<>
				<Swiper
					modules={[Navigation, EffectFade, Pagination, Autoplay]}
					slidesPerView={1}
					navigation
					pagination={{ type: "progressbar" }}
					effect="fade"
					autoplay={{ delay: 3000 }}
				>
					{listings.map(({ data, id }) => (
						<SwiperSlide
							key={id}
							onClick={() => navigate(`/category/${data.type}/${id}`)}
						>
							<div
								className="relative w-full h-[300px] overflow-hidden"
								style={{
									background: `url(${data.imgUrls[0]}) center no-repeat`,
									backgroundSize: "cover",
								}}
							></div>
							<p className="text-[#f1faee] bg-[#457b9d] absolute left-1 top-3 font-medium max-w-[90%] shadow-lg opacity-90 p-2 rounded-br-3xl">
								{data.name}
							</p>
							<p className="text-[#f1faee] bg-[#e63946] absolute left-1 bottom-1 font-semibold max-w-[90%] shadow-lg opacity-90 p-2 rounded-tr-3xl">
								$
								{data.regularPrice
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
								{data.type === "rent" && " / month"}
							</p>
						</SwiperSlide>
					))}
				</Swiper>
			</>
		)
	);
}
