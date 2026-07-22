import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Soban's Blog",
	subtitle: "Tech notes, CTF writeups, and cool things I learn along the way.",
	lang: "en",
	themeColor: {
		hue: 210,
		fixed: false,
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png",   // your banner
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Khattak761",
			external: true,
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/in/soban-msoban/",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",   // your avatar image
	name: "Soban",
	bio: "Tech related stuff, CTF writeups, and random cybersecurity things I like exploring.",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Khattak761",
		},
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/soban-msoban/",
		},
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "https://discord.com/users/sobann_32195",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "",
	url: "",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "nord",
};