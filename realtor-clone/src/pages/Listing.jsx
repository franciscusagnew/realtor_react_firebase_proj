import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

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
            <div className="fixed items-center justify-center top-[13%] right-[3%] z-10 flex cursor-pointer bg-white w-10 h-10 border-gray-400 rounded-full" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
                setTimeout(() => {
                    setShareLinkCopied(false);
                }, 2000)
            }}>
				<FaShare className="text-lg text-red-500"/>
            </div>
            {shareLinkCopied && (
                <p className="fixed top-[23%] right-[5%] border border-slate-600 text-gray-500 rounded-md bg-white z-10 p-2">Link Copied</p>
            )}
		</main>
	);
}