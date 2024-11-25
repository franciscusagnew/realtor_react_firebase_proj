import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Header() {
    const [pageState, setPageState] = useState("Sign In");
    const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const auth = getAuth();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setPageState("Profile");
			} else {
				setPageState("Sign In");
			}
		});
	}, [auth]);

	// console.log(location.pathname)
	function pathMatchRoute(route) {
		if (route === location.pathname) {
			return true;
		}
	}

    function toggle() {
        console.log("Nav toggle clicked");
        if (!isOpen) {
            console.log("isOpen: ", isOpen);
            setIsOpen(true);
        } else {
            console.log("isOpen: ", isOpen);
            setIsOpen(false);
        }
    }
	return (
		<div className="bg-white border-b shadow-sm sticky top-0 z-40">
			<header className="py-4 px-8 flex justify-between items-center max-w-6xl mx-auto md:py-0">
				<div>
					<img
						src="https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg"
						alt="Realtor Clone Logo"
						className="h-5 cursor-pointer"
						onClick={() => navigate("/")}
					/>
				</div>
				<div>
					<ul
						className={`py-3 | md:flex md:items-center md:space-x-10 ${
							isOpen ? "visible" : "hidden"
						}`}
					>
						<li
							className={`cursor-pointer py-3 font-semibold text-slate-500 hover:text-red-600 ${
								pathMatchRoute("/") && "text-red-600 font-bold"
							}`}
							onClick={() => navigate("/")}
						>
							Home
						</li>
						<li
							className={`cursor-pointer py-3 font-semibold text-slate-500 hover:text-red-600 ${
								pathMatchRoute("/offers") && "text-red-600 font-bold"
							}`}
							onClick={() => navigate("/offers")}
						>
							Offers
						</li>
						<li
							className={`cursor-pointer py-3 font-semibold text-slate-500 hover:text-red-600 ${
								(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
								"text-red-600 font-bold"
							}`}
							onClick={() => navigate("/profile")}
						>
							{pageState}
						</li>
					</ul>
				</div>
				<button
					className="fixed top-[18px] right-[5%] cursor-pointer font-semibold text-slate-500  hover:text-red-600 md:hidden"
					type="button"
					id="toggler"
					onClick={toggle}
				>
					<RxHamburgerMenu className="w-5 h-5 focus:text-red-600 focus:outline-none" />
				</button>
			</header>
		</div>
	);
}
