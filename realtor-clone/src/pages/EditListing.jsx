import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState(null);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		description: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		latitude: 0,
		longitude: 0,
		images: {},
	});
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		description,
		offer,
		regularPrice,
		discountedPrice,
		latitude,
		longitude,
		images,
	} = formData;

	const params = useParams();

	useEffect(() => {
		if (listing && listing.userRef !== auth.currentUser.uid) {
			toast.error("You can't edit this listing!");
			navigate("/");
		}
	}, [auth.currentUser.uid, listing, navigate]);

	useEffect(() => {
		setLoading(true);
		async function fetchListing() {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setFormData({ ...docSnap.data() });
				setLoading(false);
			} else {
				navigate("/");
				toast.error("Listing does not exist!");
			}
		}
		fetchListing();
	}, [navigate, params.listingId]);

	function onChange(e) {
		let boolean = null;

		if (e.target.value === "true") {
			boolean = true;
		}
		if (e.target.value === "false") {
			boolean = false;
		}
		// Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}
		// Text/Boolean/Number
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	}

	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		if (+discountedPrice >= +regularPrice) {
			setLoading(false);
			toast.error("Discounted Price needs to be less than Regular Price!");
			return;
		}

		if (images.length > 6) {
			setLoading(false);
			toast.error("Only a maximum of 6 images are allowed!");
			return;
		}

		let geolocation = {};
		let location;

		if (geoLocationEnabled) {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
			);
			const data = await response.json();
			console.log(data);
			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

			location = data.status === "ZERO_RESULTS" && undefined;

			if (location === undefined) {
				setLoading(false);
				toast.error("Please enter a correct address!");
				return;
			}
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
		}

		async function storeImage(image) {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, filename);
				const uploadTask = uploadBytesResumable(storageRef, image);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							// console.log("File available at", downloadURL);
							resolve(downloadURL);
						});
					}
				);
			});
		}

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch((error) => {
			setLoading(false);
			toast.error("Images not uploaded!");
			return;
		});

		// console.log(imgUrls);

		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
			userRef: auth.currentUser.uid,
		};
		delete formDataCopy.images;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;
		delete formDataCopy.latitude;
		delete formDataCopy.longitude;
        const docRef = doc(db, "listings", params.listingId);

		await updateDoc(docRef, formDataCopy);
		setLoading(false);
		toast.success("Listing Edited");
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	}

	if (loading) {
		return <Spinner />;
	}

	return (
		<main className="max-w-md px-2 mx-auto">
			<h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
			<form onSubmit={onSubmit}>
				<p className="text-lg mt-6 font-semibold">Sell / Rent</p>
				<div className="flex space-x-6">
					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "rent"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
						type="button"
						id="type"
						value="sell"
						onClick={onChange}
					>
						Sell
					</button>

					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "sell"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
						type="button"
						id="type"
						value="rent"
						onClick={onChange}
					>
						Rent
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Name</p>
				<input
					className="w-full px-4 py2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
					type="text"
					id="name"
					value={name}
					onChange={onChange}
					placeholder="Property Name"
					maxLength={32}
					minLength={10}
					required
				/>
				<div className="flex space-x-6 mt-6">
					<div>
						<p className="text-lg font-semibold">Beds</p>
						<input
							className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
							type="number"
							id="bedrooms"
							value={bedrooms}
							onChange={onChange}
							min={1}
							max={50}
							required
						/>
					</div>
					<div>
						<p className="text-lg font-semibold">Baths</p>
						<input
							className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
							type="number"
							id="bathrooms"
							value={bathrooms}
							onChange={onChange}
							min={1}
							max={50}
							required
						/>
					</div>
				</div>
				<p className="text-lg mt-6 font-semibold">Parking Spot</p>
				<div className="flex space-x-6">
					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							!parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="parking"
						value={true}
						onClick={onChange}
					>
						Yes
					</button>

					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="parking"
						value={false}
						onClick={onChange}
					>
						No
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Furnished</p>
				<div className="flex space-x-6">
					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							!furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="furnished"
						value={true}
						onClick={onChange}
					>
						Yes
					</button>

					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="furnished"
						value={false}
						onClick={onChange}
					>
						No
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Address</p>
				<textarea
					className="w-full px-4 py2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
					type="text"
					id="address"
					value={address}
					onChange={onChange}
					placeholder="Address"
					required
				/>
				{!geoLocationEnabled && (
					<div className="flex space-x-6 mt-6">
						<div className="">
							<p className="text-lg font-semibold">Latitude</p>
							<input
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
								type="number"
								id="latitude"
								value={latitude}
								onChange={onChange}
								required
								min={-90}
								max={90}
							/>
						</div>
						<div>
							<p className="text-lg font-semibold">Longitude</p>
							<input
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
								type="number"
								id="longitude"
								value={longitude}
								onChange={onChange}
								required
								min={-180}
								max={180}
							/>
						</div>
					</div>
				)}
				<p className="text-lg mt-6 font-semibold">Description</p>
				<textarea
					className="w-full px-4 py2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
					type="text"
					id="description"
					value={description}
					onChange={onChange}
					placeholder="Description"
					required
				/>
				<p className="text-lg mt-6 font-semibold">Offer</p>
				<div className="flex space-x-6">
					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							!offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="offer"
						value={true}
						onClick={onChange}
					>
						Yes
					</button>

					<button
						className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-full ${
							offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						type="button"
						id="offer"
						value={false}
						onClick={onChange}
					>
						No
					</button>
				</div>
				<div className="flex mt-6">
					<div>
						<p className="text-lg font-semibold">Regular Price</p>
						<div className="flex w-full justify-center items-center space-x-6">
							<input
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
								type="number"
								id="regularPrice"
								value={regularPrice}
								onChange={onChange}
								min={50}
								max={400000000}
								required
							/>
							{type === "rent" && (
								<div>
									<p className="w-full text-md whitespace-nowrap">$ / Month</p>
								</div>
							)}
						</div>
					</div>
				</div>
				{offer && (
					<div className="flex mt-6">
						<div>
							<p className="text-lg font-semibold">Discounted Price</p>
							<div className="flex w-full justify-center items-center space-x-6">
								<input
									className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus::bg-white focus:border-slate-600 text-center"
									type="number"
									id="discountedPrice"
									value={discountedPrice}
									onChange={onChange}
									min={50}
									max={400000000}
									required={offer}
								/>
								{type === "rent" && (
									<div>
										<p className="w-full text-md whitespace-nowrap">
											$ / Month
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="mt-6">
					<p className="text-lg font-semibold">Images</p>
					<p className="text-gray-600">
						The first image will be the cover (max 6)
					</p>
					<input
						className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
						type="file"
						id="images"
						onChange={onChange}
						accept=".jpg, .png, .jpeg"
                        multiple
                        required
					/>
				</div>
				<button
					className="my-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg"
					type="submit"
				>
					Edit Listing
				</button>
			</form>
		</main>
	);
}
