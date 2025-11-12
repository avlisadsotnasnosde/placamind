"use client";

import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type Placa = {
    placa: string;
    detalhes: string;
};

export default function PlacasTable() {
    const [placas, setPlacas] = useState<Placa[]>([]);
    const [filtro, setFiltro] = useState("");
    const [novoDetalhe, setNovoDetalhe] = useState("");
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        fetch("/api/placas")
            .then((res) => res.json())
            .then((data) => setPlacas(data.data))
            .catch((err) => {
                console.error("Erro ao buscar placas:", err);
                showSnackbar("Erro ao buscar placas", "error");
            });
    }, []);

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const placasFiltradas = placas.filter((p) =>
        p.placa.toLowerCase().includes(filtro.toLowerCase())
    );

    const placaExiste = placas.some(
        (p) => p.placa.toLowerCase() === filtro.toLowerCase()
    );

    const adicionarPlaca = async () => {
        if (!placaExiste && filtro.trim() && novoDetalhe.trim()) {
            const nova = { placa: filtro.toUpperCase(), detalhes: novoDetalhe };

            try {
                const res = await fetch("/api/placas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nova),
                });

                if (res.ok) {
                    setPlacas([...placas, nova]);
                    setNovoDetalhe("");
                    setFiltro("");
                    showSnackbar("Placa cadastrada com sucesso!", "success");
                } else {
                    const erro = await res.json();
                    showSnackbar(
                        erro.error || "Erro ao cadastrar placa",
                        "error"
                    );
                }
            } catch (err) {
                console.error("Erro ao cadastrar placa:", err);
                showSnackbar("Erro de rede ao cadastrar placa", "error");
            }
        }
    };

    const removerPlaca = async (placa: string) => {
        try {
            const res = await fetch("/api/placas", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placa }),
            });

            if (res.ok) {
                setPlacas(placas.filter((p) => p.placa !== placa));
                showSnackbar("Placa removida com sucesso!", "success");
            } else {
                const erro = await res.json();
                showSnackbar(erro.error || "Erro ao remover placa", "error");
            }
        } catch (err) {
            console.error("Erro ao remover placa:", err);
            showSnackbar("Erro de rede ao remover placa", "error");
        }
    };

    const editarDetalhes = async (placa: string) => {
        const registroAtual = placas.find((p) => p.placa === placa);
        const detalhesAntigos = registroAtual?.detalhes || "";

        const novosDetalhes = prompt("Editar detalhes:", detalhesAntigos);

        if (novosDetalhes && novosDetalhes !== detalhesAntigos) {
            try {
                const res = await fetch("/api/placas", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ placa, detalhes: novosDetalhes }),
                });

                const data = await res.json();

                if (res.ok) {
                    setPlacas(
                        placas.map((p) =>
                            p.placa === placa
                                ? { ...p, detalhes: novosDetalhes }
                                : p
                        )
                    );
                    showSnackbar(
                        "Detalhes atualizados com sucesso!",
                        "success"
                    );
                } else {
                    showSnackbar(data.error || "Erro ao atualizar", "error");
                }
            } catch (err) {
                console.error("Erro ao enviar PUT:", err);
                showSnackbar("Erro de rede ao atualizar", "error");
            }
        }
    };

    return (
        <Box className="space-y-4">
            <TextField
                label="Buscar placa"
                variant="outlined"
                fullWidth
                inputProps={{
                    style: {
                        textAlign: "center",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                    },
                }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value.toUpperCase())}
            />

            {placasFiltradas.length === 0 && filtro.trim() && !placaExiste && (
                <Box className="space-y-2">
                    <Typography>
                        Nenhuma placa encontrada. Deseja cadastrar{" "}
                        <strong>{filtro}</strong>?
                    </Typography>
                    <TextField
                        label="Detalhes da nova placa"
                        variant="outlined"
                        fullWidth
                        value={novoDetalhe}
                        onChange={(e) => setNovoDetalhe(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={adicionarPlaca}
                        disabled={!novoDetalhe.trim()}
                    >
                        Cadastrar
                    </Button>
                </Box>
            )}

            {placasFiltradas.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Placa</TableCell>
                            <TableCell align="center">Detalhes</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {placasFiltradas.map((p) => (
                            <TableRow key={p.placa}>
                                <TableCell align="center">{p.placa}</TableCell>
                                <TableCell align="left">{p.detalhes}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        color="info"
                                        onClick={() => editarDetalhes(p.placa)}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => removerPlaca(p.placa)}
                                    >
                                        <HighlightOffIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
