export type Availability = "morning" | "afternoon" | "evening" | "weekend";

export type Tutor = {
    id: string;
    name: string;
    subjects: string[];
    price: number;
    rating: number;
    reviews: number;
    country?: string;
    bio?: string;
    bioFull?: string;

    availability: Availability[];
    badges?: string[];    // e.g. ["Professional", "Super Tutor"]
    avatarColor?: string; // optional placeholder color seed
};
