import React, { useEffect, useState, useRef } from "react";
import "./addTransaction.scss";
import { DatePicker } from "@mantine/dates";
import {
  Autocomplete,
  NumberInput,
  Button,
  Collapse,
  TextInput,
  ActionIcon,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { IconArrowUp, IconArrowDown, IconCheck, IconMinus } from "@tabler/icons-react";
import { addMerchant, getAllMerchants } from "../../services/merchantAPICallerService";
import { addCategory, getAllCategories } from "../../services/categoryAPICallerService";
import { addTransaction } from "../../services/transactionAPICallerService";
import { Merchant } from "../../utils/merchant.model";
import { Category } from "../../utils/category.model";
import { showSuccessNotification, showErrorNotification } from "../../utils/notifications";

const AddTransaction = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [transactionMerchant, setTransactionMerchant] = useState<string>("");
  const [transactionCategory, setTransactionCategory] = useState<string>("");
  const [transactionCategoryMultiplier, setTransactionCategoryMultiplier] = useState<number>(0);
  const [transactionAmount, setTransactionAmount] = useState<number | "">("");

  const merchantNameRef = useRef<HTMLInputElement>(null);
  const [addMerchantOpened, addMerchantCollapseHandlers] = useDisclosure(false, {
    onOpen: () => {
      merchantNameRef.current!.blur();
    },
  });

  const [newMerchantName, setNewMerchantName] = useState<string>("");
  const [newMerchantCategoryName, setNewMerchantCategoryName] = useState<string>("");
  const [newMerchantCategoryMultiplier, setNewMerchantCategoryMultiplier] = useState<number>(0);

  const categoryNameRef = useRef<HTMLInputElement>(null);
  const [addCategoryOpened, addCategoryCollapseHandlers] = useDisclosure(false, {
    onOpen: () => {
      categoryNameRef.current!.blur();
    },
  });
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryMultiplier, toggleNewCategoryMultiplier] = useToggle([-1, 1]);

  useEffect(() => {
    setMerchantsArray();
    setCategoriesArray();
  }, []);

  const setMerchantsArray = () => {
    getAllMerchants().then((newMerchants) => {
      if (typeof newMerchants === "string") {
        return;
      } else {
        setMerchants(newMerchants);
      }
    });
  };

  const setCategoriesArray = () => {
    getAllCategories().then((categories) => {
      if (typeof categories === "string") {
        return;
      } else {
        setCategories(categories);
      }
    });
  };

  const addNewMerchant = async () => {
    if (newMerchantName === "") {
      showErrorNotification("Invalid Merchant Name", "Please enter a valid merchant name");
      return;
    }

    if (newMerchantCategoryName === "") {
      showErrorNotification("Invalid Category Name", "Please select a valid category");
      return;
    }

    await addMerchant({
      name: newMerchantName,
      categoryName: newMerchantCategoryName,
      multiplier: newMerchantCategoryMultiplier,
    }).then((res) => {
      if (typeof res === "string") {
        showErrorNotification("An Error Occurred", res);
      } else {
        showSuccessNotification("Merchant Added", `New merchant created with ID ${res}`);
      }
    });

    setMerchantsArray();
    addMerchantCollapseHandlers.close();
  };

  const addNewCategory = async () => {
    if (newCategoryName === "") {
      showErrorNotification("Invalid Category Name", "Please enter a valid category name");
      return;
    }

    await addCategory({
      name: newCategoryName,
      multiplier: newCategoryMultiplier,
    }).then((res) => {
      if (typeof res === "string") {
        showErrorNotification("An Error Occurred", res);
        return;
      } else {
        showSuccessNotification("Category Added", `New category created with ID ${res}`);
        setNewCategoryName("");
      }
    });

    setCategoriesArray();
    addCategoryCollapseHandlers.close();
  };

  const addNewTransaction = async () => {
    if (transactionDate == null) {
      showErrorNotification("Invalid Date", "Please select a date");
      return;
    }

    if (transactionMerchant === "") {
      showErrorNotification("Invalid Merchant", "Please select a merchant");
      return;
    }

    if (transactionAmount === "") {
      showErrorNotification("Invalid Amount", "Please enter a valid amount");
      return;
    }

    await addTransaction({
      merchantName: transactionMerchant,
      categoryName: transactionCategory,
      categoryMultiplier: transactionCategoryMultiplier,
      amount: transactionAmount as number,
      date: `${
        transactionDate.getMonth() + 1
      }/${transactionDate.getDate()}/${transactionDate.getFullYear()}`,
    }).then((res) => {
      if (typeof res === "string") {
        showErrorNotification("An Error Occurred", res);
      } else {
        showSuccessNotification("Transaction Added", `New transaction created with ID ${res}`);
        setTransactionDate(null);
        setTransactionMerchant("");
        setTransactionCategory("");
        setTransactionCategoryMultiplier(0);
        setTransactionAmount("");
      }
    });

    // close drawer here
  };

  return (
    <div id="add-transaction-container">
      <DatePicker
        value={transactionDate}
        onChange={setTransactionDate}
        size="lg"
        firstDayOfWeek={0}
        maxDate={new Date()}
        allowDeselect
      />

      <div id="add-transaction-merchant">
        <div id="add-transaction-merchant-container">
          <div id="add-transaction-merchant-name">
            <Autocomplete
              ref={merchantNameRef}
              label="Merchant"
              placeholder="Start typing..."
              data={merchants.map((merchant) => ({ ...merchant, value: merchant.name }))}
              value={transactionMerchant}
              onItemSubmit={(value) => {
                setTransactionCategory(value.categoryName);
                setTransactionCategoryMultiplier(value.multiplier);
              }}
              onChange={(value) => {
                setTransactionMerchant(value);
                if (value === "") {
                  setTransactionCategoryMultiplier(0);
                }
                addMerchantCollapseHandlers.close();
              }}
              size="md"
              nothingFound={
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={addMerchantCollapseHandlers.open}
                  fullWidth
                >
                  + Add New
                </Button>
              }
            />
          </div>

          <ThemeIcon
            variant="filled"
            size="2.6rem"
            color={
              transactionCategoryMultiplier === 0
                ? "gray"
                : transactionCategoryMultiplier < 0
                ? "red"
                : "teal"
            }
          >
            {transactionCategoryMultiplier === 0 ? (
              <IconMinus size="1rem" />
            ) : transactionCategoryMultiplier < 0 ? (
              <IconArrowDown size="1rem" />
            ) : (
              <IconArrowUp size="1rem" />
            )}
          </ThemeIcon>
        </div>

        <div id="add-transaction-add-merchant-container">
          <Collapse in={addMerchantOpened}>
            <div id="add-transaction-add-merchant-content">
              <div>
                <TextInput
                  label="New Merchant Name"
                  placeholder="Name"
                  value={newMerchantName}
                  onChange={(event) => setNewMerchantName(event.currentTarget.value)}
                />
              </div>

              <div id="add-transaction-add-merchant-category-container">
                <div id="add-transaction-add-merchant-category-name">
                  <Autocomplete
                    ref={categoryNameRef}
                    label="Category"
                    placeholder="Select a category"
                    data={categories.map((category) => ({ ...category, value: category.name }))}
                    value={newMerchantCategoryName}
                    onItemSubmit={(value) => {
                      setNewMerchantCategoryMultiplier(value.multiplier);
                    }}
                    onChange={(value) => {
                      setNewMerchantCategoryName(value);
                      if (value === "") {
                        setNewMerchantCategoryMultiplier(0);
                      }
                      addCategoryCollapseHandlers.close();
                    }}
                    nothingFound={
                      <Button
                        variant="subtle"
                        color="gray"
                        onClick={addCategoryCollapseHandlers.open}
                        fullWidth
                      >
                        + Add New
                      </Button>
                    }
                  />
                </div>

                <ThemeIcon
                  variant="filled"
                  size="2.25rem"
                  color={
                    newMerchantCategoryMultiplier === 0
                      ? "gray"
                      : newMerchantCategoryMultiplier < 0
                      ? "red"
                      : "teal"
                  }
                >
                  {newMerchantCategoryMultiplier === 0 ? (
                    <IconMinus size="1rem" />
                  ) : newMerchantCategoryMultiplier < 0 ? (
                    <IconArrowDown size="1rem" />
                  ) : (
                    <IconArrowUp size="1rem" />
                  )}
                </ThemeIcon>

                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="2.25rem"
                  onClick={addNewMerchant}
                  disabled={addCategoryOpened}
                >
                  <IconCheck size="1rem" />
                </ActionIcon>
              </div>

              <div id="add-transaction-add-category-container">
                <Collapse in={addCategoryOpened}>
                  <div id="add-transaction-add-category-content">
                    <div id="add-transaction-add-category-name">
                      <TextInput
                        label="New Category Name"
                        placeholder="Name"
                        value={newCategoryName}
                        onChange={(event) => setNewCategoryName(event.currentTarget.value)}
                      />
                    </div>

                    <ActionIcon
                      variant="filled"
                      color={newCategoryMultiplier < 0 ? "red" : "teal"}
                      size="2.25rem"
                      onClick={() => toggleNewCategoryMultiplier()}
                    >
                      {newCategoryMultiplier < 0 ? (
                        <IconArrowDown size="1rem" />
                      ) : (
                        <IconArrowUp size="1rem" />
                      )}
                    </ActionIcon>

                    <ActionIcon
                      variant="filled"
                      color="blue"
                      size="2.25rem"
                      onClick={addNewCategory}
                    >
                      <IconCheck size="1rem" />
                    </ActionIcon>
                  </div>
                </Collapse>
              </div>
            </div>
          </Collapse>
        </div>
      </div>

      <div id="add-transaction-amount">
        <NumberInput
          label="Amount"
          precision={2}
          value={transactionAmount}
          onChange={setTransactionAmount}
          size="md"
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          hideControls
        />
      </div>

      <div className="add-transaction-buttons">
        <Button id="add-transaction-add-button" onClick={addNewTransaction}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddTransaction;
