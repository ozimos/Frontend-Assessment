import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookies from 'react-cookies';
import {
  Button, Heading, Text, Flex, Link
} from '@chakra-ui/core';
import {
  Container, Layout, Nav
} from '../../../components'
import { HOST_URL, SUCCESS, ERROR } from '../../../constants';
import retrieveToken from '../../../utils/retrieveToken';

export const getServerSideProps = async ({req}) => {
  const token = retrieveToken(req);
  try {
    const res = await axios.get(`${HOST_URL}/api/users`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return {
      props: {
        status: SUCCESS,
        users: res.data.data
      },
    }
  } catch(err) {
    return {
      props: {
        status: ERROR,
        users: [],
      },
    }
  }
}

export default function UserLists({status, users}) {
  const router = useRouter();

  useEffect(() => {
    const expectToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN
    const token = cookies.load('token')
    if (expectToken !== token) {
      router.push('/admin')
    }
  })

  return (
    <Layout>
      <Nav/>
      <Container>
        <Button
          leftIcon="add"
          variantColor="teal"
          borderRadius={7}
          fontSize={14}
          ml={2} mr={2} mb={2}
        >
          <a href="/admin/users/create">Create User</a>
        </Button>

        <Heading textAlign="center" color="#3E576A" as="h3" size="lg">
          Registered Users
        </Heading>

        <Flex direction="column" mt="2" mb={4}>
          <Flex
            bg="#319795" boxShadow="md" minHeight="3rem" mb={4}
            pt={5} pb={5} borderRadius={5} fontWeight="bold" color="#FFFFFF"
          >
            <Text width="50%" pl={5} >Username</Text>
            <Text width="50%" pl={5}>Email</Text>
          </Flex>
            {users.map((user) => (
              <Link href={`/users/${user.username}/notes`} mb={3}  key={user.id}>
                <Flex
                  bg="#FFFFFF" boxShadow="md" minHeight="3rem"
                  pt={5} pb={5} borderRadius={5}
                >
                  <Text width="50%" pl={5} >{user.username}</Text>
                  <Text width="50%" pl={5}>{user.email}</Text>
                </Flex>
              </Link>
            ))}
        </Flex>

      </Container>
    </Layout>
  )
}
