"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Chat() {
  // --- States ---
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputCode) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputCode }),
      });
      const data = await res.json();
      setOutputCode(data.output || "No response");
    } catch (e) {
      setOutputCode("Error: " + e);
    } finally {
      setLoading(false);
    }
  };

  const inputColor = useColorModeValue("navy.700", "white");
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={bgColor}
      p={6}
    >
      <Box w="100%" maxW="600px">
        <Input
          placeholder="Type your message..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          color={inputColor}
          mb={3}
        />
        <Button
          onClick={handleTranslate}
          isLoading={loading}
          colorScheme="blue"
          w="100%"
        >
          Send
        </Button>
        <Box
          mt={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="whiteAlpha.200"
          color="white"
          minH="150px"
        >
          {outputCode}
        </Box>
      </Box>
    </Flex>
  );
}
