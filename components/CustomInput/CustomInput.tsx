import React, {
  ReactElement,
  useState,
  useEffect,
  JSXElementConstructor,
} from "react";
import { MdError } from "react-icons/md";

interface CustomInputProps {
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
  type?: string;
  errorMessage?: string;
  className?: string;
}

const CustomInput = ({
  value,
  onChange,
  placeholder,
  leftIcon,
  type = "text",
  errorMessage,
  className = ""
}: CustomInputProps) => {
  const [localValue, setLocalValue] = useState(value || "");

  // useEffect(() => {
  //   if (value !== undefined) {
  //     setLocalValue(value);
  //   }
  // }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (!value) {
    //   setLocalValue(event.target.value);
    // }
    onChange?.(event);
  };

  return (
    <div>
      <div className="relative flex flex-row">
        {leftIcon && (
          <div className="absolute h-full left-3">
            {React.cloneElement(leftIcon, {
              className: "h-full w-5 text-white",
            })}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder || ""}
          value={value}
          onChange={handleChange}
          className={`formfield-box bg-transparent transition-all focus:outline-none  text-white bg-brand-300 rounded w-full ${
            leftIcon ? "pl-10" : "pl-3"
          } ${
            errorMessage
              ? "border-red-500 focus:border-red-500"
              : "border-secondary-200"
          }
          ${className}
          `}
        />

        {errorMessage && (
          <div className="absolute h-full right-2">
            <MdError className="h-full w-5 text-red-500" />
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="text-sm text-red-500 mb-0 mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default CustomInput;
