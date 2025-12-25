import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import Modal from "@/components/Modal/Modal";
import Select, { SingleOption } from "@/components/Select/Select";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { PledgesOnEachOption } from "ergofunctions/fields";
import { roundToCurrencyDecimal } from "ergofunctions/frontend_helpers";
import { showMsg } from "ergofunctions/helpers";
import React, { Fragment, useState } from "react";
import { MdHdrAutoSelect, MdList, MdNumbers } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  setOpen: any;
  submitPledge: (optionSelected: number, pledgeSize: number) => void;
  submitting: boolean;
  fieldOptions: PledgesOnEachOption[];
}

const PledgeModal = ({
  isOpen,
  setOpen,
  submitPledge,
  submitting,
  fieldOptions,
}: ModalProps) => {
  const [selectedField, setSelectedField] = useState<SingleOption | null>(null);
  const [amountToPledge, setAmountToPledge] = useState("");
  const allFields = fieldOptions.map((item, index) => ({
    id: index,
    name: item.option,
    value: item.option,
  }));

  const handleSelect = (val: SingleOption) => {
    console.log("fieldOptions[val.id]", fieldOptions[val.id]);
    setSelectedField(val);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    // Max decimals for ERG
    const maxDecimals = 9;
    const finalPrice = roundToCurrencyDecimal(newVal, maxDecimals);

    setAmountToPledge(finalPrice);
  };

  const handleSubmit = () => {
    // if not field selected
    if (!selectedField?.id && selectedField?.id !== 0) {
      showMsg("You must select a field", true)
      // Show a toast or error message
      return;
    }
    // If no amount input
    if (
      !amountToPledge ||
      amountToPledge === "0" ||
      amountToPledge.replace(" ", "") === ""
    ) {
      // Show a toast or error message
      showMsg("You must enter an amount to pledge", true)

      return;
    }

    submitPledge(selectedField.id, parseFloat(amountToPledge));
  };

  return (
    <Fragment>
      <Modal
        open={isOpen}
        setOpen={() => setOpen(true)}
        key={"kyamodal"}
        size="max-w-2xl"
      >
        <div className="text-white">
          <p className="text-2xl mb-4 font-bold">Participate In This Field</p>
          <div className="flex flex-col space-y-6">
            <div className="">
              <p className="mb-2 text-sm font-semibold">Select your field</p>
              {/* <CustomInput
              leftIcon={<MdNumbers />}
              className="py-2 pr-3 text-lg border border-white"
            /> */}
              <Select
                onChange={handleSelect}
                leftIcon={<MdList />}
                className="text-base"
                label="Select Field"
                options={allFields}
              />
            </div>
            <div className="">
              <p className="mb-2 text-sm font-semibold">
                Type in amount of ERG
              </p>
              <CustomInput
                leftIcon={<CurrencyDollarIcon />}
                className="py-2.5 pr-3 text-base ring-gray-300 ring-1 ring-inset"
                onChange={handleInput}
                value={amountToPledge}
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-row mt-8 space-x-2 items-center justify-end">
            <Button onClick={() => setOpen(false)} colorScheme="white">
              Cancel
            </Button>
            <Button
              disabled={!selectedField}
              className=""
              loading={submitting}
              onClick={handleSubmit}
            >
              Submit Pledge
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default PledgeModal;
