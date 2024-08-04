"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, TextField, Typography, Stack, Button } from "@mui/material";
import { collection, query, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((docSnap) => {
        console.log("Document data:", docSnap.data()); // Debugging log
        inventoryList.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const addItem = async (itemName) => {
    console.log("Adding item:", itemName); // Debugging log
    if (!itemName.trim()) return; // Exit if item is empty

    const docRef = doc(firestore, "inventory", itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1, name: itemName }); // Explicitly set the name field
    }

    await updateInventory();
  };

  const removeItem = async (itemName) => {
    console.log("Removing item:", itemName); // Debugging log
    const docRef = doc(firestore, "inventory", itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
    // No dependencies here, so it will run once on mount
  }, []);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleAddItem = () => {
    const trimmedName = itemName.trim();
    if (trimmedName) {
      addItem(trimmedName);
      setItemName("");
      handleClose();
    } else {
      console.error("Item name cannot be empty");
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
            zIndex: 1300,  // Ensure it's above other content
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack 
            width="100%" 
            direction="row" 
            spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={handleAddItem}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="lightblue"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      </Box>
      <Stack
        width="800px"
        height="300px"
        spacing={2}
        overflow="auto"
      >
        {inventory.map(({ id, name, quantity }) => (
          <Box
            key={id}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={5}
          >
            <Typography
              variant="h3"
              color="#333"
              textAlign="center"
            >
              {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unnamed Item"}
            </Typography>
            <Typography
              variant="h3"
              color="#333"
              textAlign="center"
            >
              {quantity}
            </Typography>
            <Button
              variant="contained"
              onClick={() => addItem(name)}
            >
              Add
            </Button>
            <Button
              variant="contained"
              onClick={() => removeItem(name)}
            >
              Remove
            </Button>

          </Box>
        ))}
      </Stack>
    </Box>
  );
}


