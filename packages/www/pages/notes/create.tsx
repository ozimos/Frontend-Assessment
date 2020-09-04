import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Button, Flex, FormControl, FormLabel,
  Input, Textarea, useToast
} from '@chakra-ui/core';
import {
  Container, Layout, Nav
} from '../../components';

export default function CreateNote() {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isEmptyDescription, setIsEmptyDescription] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleTitleChange = event =>{
    setTitle(event.target.value)
    setIsEmptyTitle(false);
  };

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
    setIsEmptyDescription(false);
  };
  
  const addNote = async(event) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setIsEmptyTitle(true);
      return;
    }
    if (description.trim().length === 0) {
      setIsEmptyDescription(!isEmptyDescription);
      return;
    }
    setIsSending(true);

    try {
      const response = await axios.post(`/api/notes/create`, {
        title,
        description
      })
      toast({
        title: "Note added",
        description: "Note successfully added",
        status: "success",
        position: "top",
        duration: 9000,
        isClosable: true
      });
      router.push('/');
    } catch (err) {
      setIsSending(false);
      toast({
        title: "An error occurred.",
        description: "Something went wrong. Try again",
        status: "error",
        position: "top",
        duration: 9000,
        isClosable: true
      })
    }

  }

  return (
    <Layout>
      <Nav/>
      <Container>
        <form>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Type in the note title here"
              variant={isEmptyTitle ? "outline" : "unstyled"}
              value={title}
              onChange={handleTitleChange}
              isInvalid={isEmptyTitle}
            />
          </FormControl>
          <hr className="line"/>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Type in the note decription here"
              variant={isEmptyDescription ? "outline" : "unstyled"}
              onChange={handleDescriptionChange}
              value={description}
              isInvalid={isEmptyDescription}
            />
          </FormControl>
          <Flex mt={4} mb={5} justify="flex-end">
            <Button
              type="submit"
              onClick={addNote}
              variantColor="blue"
              borderRadius={7}
              fontSize={14}
              ml={1} mr={1}
              isLoading={isSending}
              loadingText="Saving"
            >
              Add Note
            </Button>
          </Flex>
        </form>
      </Container>
      <style jsx>{`
        .line {
          height: 2px;
          background-color: #3E576A;
          margin-top: 10px;
      }
      `}</style>
    </Layout>
  )
}
