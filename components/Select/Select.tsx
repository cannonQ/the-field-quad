import React, { Fragment, JSXElementConstructor, ReactElement, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export interface SingleOption {
    id: number;
    value: string | number;
    name: string | number;
}

interface SelectProps {
    label: string;
    options: SingleOption[];
    onChange: (params: any) => void;
    className?: string;
    leftIcon?: ReactElement<any, string | JSXElementConstructor<any>>;
}

export default function Select({label, options, leftIcon,onChange, className = ""}: SelectProps) {
  const [selected, setSelected] = useState<SingleOption | null>(null)

  const handleSelect = (e: SingleOption) => {
    setSelected(e);
    onChange(e)
  }

  const textSize = "sm:text-sm"

  const curClass = `relative w-full cursor-pointer rounded bg-inherit py-2.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${textSize} sm:leading-6 ${className}`

  return (
    <Listbox value={selected} onChange={handleSelect}>
      {({ open }) => (
        <>
          {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label> */}
          <div className="relative mt-2">
            <Listbox.Button className={curClass}>
                <div className='flex flex-row'>

                {/* {leftIcon && (
                <div className="absolute h-full left-3">
                    {React.cloneElement(leftIcon, {
                    className: "h-full w-5 text-white",
                    })}
                </div>
                )} */}
                {leftIcon && (

                <span>
                    {React.cloneElement(leftIcon, {
                    className: "w-5 text-white h-full mr-2",
                    })}
                </span>
                )
                    }
              <span className={`block truncate ${selected?.name ? "": "text-gray-300"}`}>{selected?.name ? selected.name : label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-200" aria-hidden="true" />
              </span>
              </div>

            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-brand-500 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${textSize}`}>
                {options.map((opt: SingleOption) => (
                  <Listbox.Option
                    key={opt.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-blue-600 text-white' : 'text-gray-200',
                        'relative cursor-pointer select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={opt}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {opt.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-gray-300',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
