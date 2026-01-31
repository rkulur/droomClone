import { useEffect, useRef, useState } from "react";
import caretDown from "../assets/header/caret-down-solid-full.svg";
import type { InputOption } from "../const";

type DropdownProps = {
  options: InputOption[];
  currOption: InputOption;
  setCurrOption: (option: InputOption) => void;
};

const Dropdown = ({ options, currOption, setCurrOption }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [openTrendingSearch, setOpenTrendingSearch] = useState(false);

  const parent = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const handleSelect = (idx: number) => {
    setCurrOption(options[idx]);
    setOpen(!open);
    setOpenTrendingSearch((prev) => !prev);
  };

  const handleTrendingSearch = () => {
    //TODO: navigate to trendingSearch.srcLink
    setOpenTrendingSearch(false);
  };

  const handleDropdown = () => {
    if (openTrendingSearch) {
      setOpenTrendingSearch((prev) => !prev);
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const clickOutsideMenu =
        container.current && !container.current.contains(e.target as Node);
      if (clickOutsideMenu) {
        setOpen(false);
        setOpenTrendingSearch(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="flex gap-3" onClick={handleDropdown} ref={parent}>
        <p className="h-fit">
          {currOption.title.length <= 3
            ? currOption.title
            : currOption.title.slice(0, 3) + "..."}
        </p>
        <img className="w-5 h-fit" src={caretDown} alt="caretDown" />
      </div>

      <div ref={container}>
        {open && (
          <div className="border absolute bg-white z-10 left-0 top-16 rounded-md border-gray-300">
            {options.map((option, idx) => (
              <div
                key={`${idx}${option}`}
                onClick={() => handleSelect(idx)}
                className="py-2 px-3 hover:bg-gray-100"
              >
                {option.title}
              </div>
            ))}
          </div>
        )}
        {openTrendingSearch && (
          <div className="border absolute bg-white z-10 left-0 top-16 rounded-md border-gray-300">
            <h2 className="text-center font-semibold py-2 bg-blue-100">
              TRENDING SEARCHES
            </h2>
            {currOption.trendingSearches.map((trendingSearch, idx) => (
              <div
                key={`${idx}${trendingSearch}`}
                onClick={handleTrendingSearch}
                className="py-2 px-3 hover:bg-gray-100"
              >
                {trendingSearch.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dropdown;
