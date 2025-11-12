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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const [modalAberto, setModalAberto] = useState(false);
    const [placaEditando, setPlacaEditando] = useState("");
    const [detalhesEditando, setDetalhesEditando] = useState("");

    useEffect(() => {
        fetch("/api/placas/")
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
                const res = await fetch("/api/placas/", {
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
            const res = await fetch("/api/placas/", {
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

    const abrirModalEdicao = (placa: string) => {
        const registro = placas.find((p) => p.placa === placa);
        setPlacaEditando(placa);
        setDetalhesEditando(registro?.detalhes || "");
        setModalAberto(true);
    };

    const salvarEdicao = async () => {
        if (detalhesEditando.trim()) {
            try {
                const res = await fetch("/api/placas/", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        placa: placaEditando,
                        detalhes: detalhesEditando,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    setPlacas(
                        placas.map((p) =>
                            p.placa === placaEditando
                                ? { ...p, detalhes: detalhesEditando }
                                : p
                        )
                    );
                    showSnackbar(
                        "Detalhes atualizados com sucesso!",
                        "success"
                    );
                    setModalAberto(false);
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
                <Box className="space-y-5">
                    <Typography variant="h6" color="error" sx={{ margin: 1 }}>
                        Placa não encontrada:
                    </Typography>
                    <Typography variant="h5" sx={{ margin: 1 }}>
                        <strong>{filtro}</strong>
                    </Typography>
                    <Typography variant="h6" color="error" sx={{ margin: 1 }}>
                        Deseja cadastrar?
                    </Typography>
                    <TextField
                        label="Detalhes da nova placa"
                        variant="outlined"
                        fullWidth
                        value={novoDetalhe}
                        onChange={(e) => setNovoDetalhe(e.target.value)}
                        inputProps={{
                            style: {
                                textAlign: "center",
                                letterSpacing: "0.05em",
                                textTransform: "capitalize",
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={adicionarPlaca}
                        disabled={!novoDetalhe.trim()}
                        sx={{ margin: 2 }}
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
                                        onClick={() =>
                                            abrirModalEdicao(p.placa)
                                        }
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

            <Dialog
                open={modalAberto}
                onClose={() => setModalAberto(false)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setModalAberto(false);
                    }
                    if (e.key === "Enter") {
                        e.preventDefault();
                        salvarEdicao();
                    }
                }}
            >
                <DialogTitle>Editar detalhes da placa</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Detalhes"
                        fullWidth
                        multiline
                        value={detalhesEditando}
                        onChange={(e) => setDetalhesEditando(e.target.value)}
                        error={!detalhesEditando.trim()}
                        helperText={
                            !detalhesEditando.trim()
                                ? "Este campo não pode estar vazio."
                                : ""
                        }
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalAberto(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={salvarEdicao}
                        disabled={!detalhesEditando.trim()}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
