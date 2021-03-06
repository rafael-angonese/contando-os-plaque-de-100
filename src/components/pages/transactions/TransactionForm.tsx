import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { IAccount } from "../../../@types/accounts/accounts";
import { ICategory } from "../../../@types/accounts/categories";
import { IFile } from "../../../@types/file";
import { AccountContext } from "../../../contexts/AccountContext";
import { ITransactionFormatted } from "../../../pages/transactions";
import api from "../../../services/api";
import handlingErrors from "../../../utils/handlingErrors";
import DropZone from "../../DropZone/DropZone";
import FileList from "../../FileList/FileList";
interface ICategoryFields {
  date: Date | null | string;
  category_id: string;
  description: string;
  amount: string | number;
  bank_account_id: string;
}

const INITIAL_FORM_STATE = {
  date: null,
  category_id: "",
  description: "",
  amount: 0,
  bank_account_id: "",
};

export const FORM_VALIDATION = yup.object().shape({
  date: yup.date().required(),
  category_id: yup.string().required(),
  description: yup.string().required(),
  amount: yup.number().min(0.1).required(),
  bank_account_id: yup.string().required(),
});

interface ITransactionFormProps {
  onClose: (refresh: boolean) => void;
  transaction: ITransactionFormatted | null;
}

const TransactionForm: React.FC<ITransactionFormProps> = ({
  onClose,
  transaction,
}) => {
  const [type, setType] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<ICategory[]>([]);
  const [accountOptions, setAccountOptions] = useState<IAccount[]>([]);
  const { account } = useContext(AccountContext);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICategoryFields>({
    resolver: yupResolver(FORM_VALIDATION),
    defaultValues: INITIAL_FORM_STATE,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ICategoryFields) => {
    setLoading(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (data.date && typeof data.date !== "string") {
      formData.set("date", data!.date!.toISOString());
    }
    formData.append("type", type);
    formData.append("account_id", account!.id);

    uploadedFiles.forEach((uploadedFile) => {
      formData.append("files", uploadedFile.file);
    });

    try {
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, formData);

        toast.success("Registro atualizado com sucesso!");
      } else {
        await api.post("/transactions", formData);

        toast.success("Registro criado com sucesso!");
      }

      reset();
      setType("");
      setUploadedFiles([]);
      onClose(true);
    } catch (error) {
      toast.error("N??o foi poss??vel criar esse registro!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (files: File[]) => {
    const newFiles = files.map((file) => {
      return {
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      };
    });

    setUploadedFiles(newFiles);
  };

  const getCategories = async () => {
    try {
      const { data } = await api.get<ICategory[]>("/categories");

      setCategoryOptions(data);
    } catch (error) {
      handlingErrors(error);
    }
  };

  const getAccounts = async () => {
    try {
      const { data } = await api.get<IAccount[]>("/bank-accounts");

      setAccountOptions(data);
    } catch (error) {
      handlingErrors(error);
    }
  };

  useEffect(() => {
    getCategories();
    getAccounts();

    if (transaction) {
      setValue("date", new Date(transaction.date).toISOString().split("T")[0]);
      setValue("category_id", transaction.category_id);
      setValue("description", transaction.description);
      setValue("amount", transaction.amount);
      setValue("bank_account_id", transaction.bank_account_id);
      setType(transaction.type);
    }
  }, [transaction, setValue]);

  return (
    <>
      <Flex justifyContent="flex-start">
        <Button
          marginRight="1rem"
          colorScheme="green"
          onClick={() => setType("credit")}
        >
          Criar recebimento
        </Button>
        <Button
          marginRight="1rem"
          colorScheme="red"
          onClick={() => setType("debit")}
        >
          Criar pagamento
        </Button>
      </Flex>

      {type && (
        <Box
          marginY="1.72rem"
          padding="2rem"
          border="0.1rem solid"
          borderRadius="1rem"
          borderColor={type === "credit" ? "green.400" : "red.400"}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={12} spacing={10}>
              <GridItem colSpan={2}>
                <FormControl isInvalid={!!errors?.date}>
                  <FormLabel>Data</FormLabel>
                  <Input type="date" {...register("date")} />
                  <FormErrorMessage fontSize="1.25rem">
                    {errors?.date?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isInvalid={!!errors?.category_id}>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    placeholder="Selecione a categoria"
                    {...register("category_id")}
                  >
                    {categoryOptions.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </Select>
                  <FormErrorMessage fontSize="1.25rem">
                    {errors?.category_id?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={3}>
                <FormControl isInvalid={!!errors?.description}>
                  <FormLabel>Descri????o</FormLabel>
                  <Input {...register("description")} />
                  <FormErrorMessage fontSize="1.25rem">
                    {errors?.description?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isInvalid={!!errors?.amount}>
                  <FormLabel>Valor</FormLabel>
                  <NumberInput precision={2}>
                    <NumberInputField {...register("amount")} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage fontSize="1.25rem">
                    {errors?.amount?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isInvalid={!!errors?.bank_account_id}>
                  <FormLabel>Conta</FormLabel>
                  <Select
                    placeholder="Selecione a conta"
                    {...register("bank_account_id")}
                  >
                    {accountOptions.map((account) => {
                      return (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      );
                    })}
                  </Select>
                  <FormErrorMessage fontSize="1.25rem">
                    {errors?.bank_account_id?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={12}>
                <DropZone onUpload={handleUpload} />
                {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
              </GridItem>

              <GridItem colSpan={12}>
                Anexos:
                {transaction &&
                  transaction.fileOnTransaction.map((fileTransaction) => {
                    return (
                      <p key={fileTransaction.id}>
                        {fileTransaction.file.original_name}
                      </p>
                    );
                  })}
              </GridItem>

              <GridItem colSpan={12}>
                <Button
                  isLoading={loading}
                  marginRight="1rem"
                  onClick={() => {
                    reset();
                    setType("");
                    setUploadedFiles([]);
                    onClose(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  bg="purple.400"
                  marginRight="1rem"
                  _hover={{ bg: "purple.500" }}
                  type="submit"
                  isLoading={loading}
                >
                  Salvar
                </Button>
              </GridItem>
            </SimpleGrid>
          </form>
        </Box>
      )}
    </>
  );
};

export default TransactionForm;
