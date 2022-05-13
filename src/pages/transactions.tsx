import {
  Button,
  Center,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { ITransaction } from "../@types/accounts/transactions";
import NewTransaction from "../components/pages/transactions/NewTransaction";
import api from "../services/api";
import handlingErrors from "../utils/handlingErrors";

const CategoriesPage: NextPage = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const handlingDeleteAccount = async (id: string) => {
    const toastId = toast.loading("Excluindo...");

    try {
      const response = await api.delete(`/transactions/${id}`);

      const newTransactions = transactions.filter(
        (transaction) => transaction.id !== id
      );

      setTransactions(newTransactions);

      toast.update(toastId, {
        render: "Registro excluído com sucesso!",
        type: "success",
        isLoading: false,
      });
    } catch (error) {
      // fix https://github.com/fkhadra/react-toastify/issues/720
      setTimeout(() => {
        toast.update(toastId, {
          render: "Não foi possível excluir esse registro!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }, 100);
    }
  };

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await api.get<ITransaction[]>("/transactions");

        setTransactions(response.data);
      } catch (error) {
        handlingErrors(error);
      }
    }

    getTransactions();
  }, []);

  return (
    <>
      <Center>
        <Text
          as="h1"
          fontWeight="bold"
          color="grey.50"
          fontSize="4rem"
          marginTop="1.72rem"
          lineHeight="5.75rem"
          wordBreak="break-word"
        >
          Transações
          <span style={{ color: "#04e168" }}>.</span>
        </Text>
      </Center>
      <NewTransaction />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Ações</Th>
            <Th>Data</Th>
            <Th>Categoria</Th>
            <Th>Descrição</Th>
            <Th>Valor</Th>
            <Th>Conta</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions &&
            transactions.map((account) => {
              return (
                <Tr key={account.id}>
                  <Td>
                    <Link href={`/categories/show/${account.id}`}>
                      <IconButton
                        aria-label="Visualizar"
                        color="green.400"
                        variant="ghost"
                        fontSize="20px"
                        icon={<AiOutlineEye />}
                      />
                    </Link>

                    <Link href={`/categories/edit/${account.id}`}>
                      <IconButton
                        aria-label="Editar"
                        color="yellow.400"
                        variant="ghost"
                        fontSize="20px"
                        icon={<AiOutlineEdit />}
                      />
                    </Link>

                    <IconButton
                      aria-label="Excluir"
                      color="red.400"
                      variant="ghost"
                      fontSize="20px"
                      onClick={() => handlingDeleteAccount(account.id)}
                      icon={<AiOutlineDelete />}
                    />
                  </Td>
                  <Td>{account.date}</Td>
                  <Td>{account.category_id}</Td>
                  <Td>{account.description}</Td>
                  <Td>{account.amount}</Td>
                  <Td>{account.account_id}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </>
  );
};

export default CategoriesPage;