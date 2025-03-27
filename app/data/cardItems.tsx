import { CardItem } from "../components/FeatureCard";
import React from "react";

export const cardItems: CardItem[] = [
  {
    id: "1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 13V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V13M21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13M21 13H3" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Trip to Japan in April",
    description: "Manus integrates comprehensive travel planning with local insights."
  },
  {
    id: "2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V16M12 16L16 12M12 16L8 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Deeply Analyze Tesla Stocks",
    description: "Manus delivers in-depth stock analysis with market insights."
  },
  {
    id: "3",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14L19 19M15 9.5C15 12.5376 12.5376 15 9.5 15C6.46243 15 4 12.5376 4 9.5C4 6.46243 6.46243 4 9.5 4C12.5376 4 15 6.46243 15 9.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Interactive Course on the Momentum Theorem",
    description: "Manus develops interactive physics learning experiences."
  },
  {
    id: "4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Comparative Analysis of Insurance Policies",
    description: "Looking to compare different insurance options for you."
  }
]; 