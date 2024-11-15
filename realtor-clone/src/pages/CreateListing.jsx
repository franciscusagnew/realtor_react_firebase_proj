import { useState } from "react";

export default function CreateListing() {
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		description: "",
		offer: true,
		regularPrice: 0,
		discountedPrice: 0,
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
	} = formData;

	function onChange() {}
	return (
		<main className="max-w-md px-2 mx-auto">
			<h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
			<form>
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
						value="sell"
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
					Create Listing
				</button>
			</form>
		</main>
	);
}
