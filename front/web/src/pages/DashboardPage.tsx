import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import type { IItem } from "@gaia/shared-type";
import { fetchItems, createItem, deleteItem } from "../api/items";

export default function DashboardPage() {
  const [items, setItems] = useState<IItem[]>([]);
  const [name, setName] = useState("");

  const load = () => {
    fetchItems().then(setItems).catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createItem({ name: name.trim() });
    setName("");
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    load();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            size="small"
            label="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button variant="contained" onClick={handleCreate}>
            Add
          </Button>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No items yet. Create one above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
