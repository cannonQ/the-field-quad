import Link from "next/link";
import React, { HTMLAttributes } from "react";
import Fade from "../Fade/Fade";
import LoadingCircle from "../LoadingCircle/LoadingCircle";

interface ButtonProps {
  colorScheme?: "primary" | "blue" | "orange" | "red" | "green" | "purple" | "white";
  buttonStyle?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "link"
    | "outline"
    | "green";
  internal?: boolean;
  href?: string;
  className?: string;
  variant?: "primary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  animate?: boolean;
  icon?: string;
  children?: JSX.Element | JSX.Element[] | string | string[];
  [key: string]: unknown;
}

const renderIcon = (iconName: string) => {
  if (iconName) {
    return "<" + { iconName } + "/>";
  } else {
  }
};

export const Button: React.FC<ButtonProps> = ({
  colorScheme = "primary",
  className = "",
  href,
  internal = true,
  buttonStyle = "secondary",
  variant = "primary",
  animate = false,
  icon = "",
  children,
  disabled,
  loading = false,
  ...rest
}): JSX.Element => {
  // const classes = ['cursor-pointer hover:shadow-lg m-0 py-2 px-6 text-center rounded-3xl inline-block font-bold'];

  // if (disabled) {
  //     classes.push('cursor-not-allowed bg-dark-300 hover:bg-dark-300 active:bg-dark-300 text-dark-350');
  // }

  let buttonColorScheme =
    variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : "";
  if (colorScheme === "orange") {
    buttonColorScheme = "bg-orange-600 hover:bg-orange-700 text-white";
  }
  else if (colorScheme === "green") {
    buttonColorScheme = "bg-green-600 hover:bg-green-700 text-white";
  }
  else if (colorScheme === "purple") {
    buttonColorScheme = "bg-purple-600 hover:bg-purple-700 text-white";
  }
  else if (colorScheme === "red") {
    buttonColorScheme = "bg-red-500 hover:bg-red-600 text-white";
  }
  else if (colorScheme === "white") {
    buttonColorScheme = "bg-white hover:bg-white/60 text-black text-black";
  }

  let variantClass = "";
  if (variant === "outline") {
    variantClass = "bg-transparent text-black dark:text-white border-white";
  }

  const classes = `transition-all 
    flex items-center justify-center px-4 py-2 font-medium ${variantClass} rounded-sm focus:outline-none
    ${disabled ? "opacity-60" : "cursor-pointer"}
    ${buttonColorScheme} 
  `;

  if (internal && href?.length) {
    return (
      <Link href={href} className={classes + " " + className} {...rest}>
        {children}
      </Link>
    );
  }

  if (!internal && href?.length) {
    return (
      <a href={href} className={classes + " " + className} {...rest}>
        {children}
      </a>
    );
  }

  if (loading) {
    return (
      <button className={classes + " " + className} disabled={true} {...rest}>
        <div className="px-4 py-1">
          <Fade fadeKey={"loaderupgrade"} fadeDuration={0.2}>
            <div className="w-4">
              <LoadingCircle color="neutral" />
            </div>
          </Fade>
        </div>
      </button>
    );
  }

  return (
    <button className={classes + " " + className} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
