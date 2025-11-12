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

    useEffect(() => {
        fetch("/api/placas")
            .then((res) => res.json())
            .then((data) => setPlacas(data.data)) // ajustado para acessar `data.data`
            .catch((err) => console.error("Erro ao buscar placas:", err));
    }, []);

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
                } else {
                    const erro = await res.json();
                    alert(erro.error || "Erro ao cadastrar placa");
                }
            } catch (err) {
                console.error("Erro ao cadastrar placa:", err);
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
            } else {
                const erro = await res.json();
                alert(erro.error || "Erro ao remover placa");
            }
        } catch (err) {
            console.error("Erro ao remover placa:", err);
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
                    alert("Detalhes atualizados com sucesso!");
                } else {
                    alert(data.error || "Erro ao atualizar");
                }
            } catch (err) {
                console.error("Erro ao enviar PUT:", err);
                alert("Erro de rede");
            }
        }
    };

    return (
        <div className="space-y-4 ">
            <TextField
                label="Buscar placa"
                variant="outlined"
                fullWidth
                sx={{
                    textAlign: "center", // Centraliza o texto digitado
                    letterSpacing: "0.3em", // Espaçamento entre letras
                    textTransform: "uppercase", // Transforma em maiúsculas
                }}
                inputProps={{
                    sx: {
                        textAlign: "center", // Centraliza o texto digitado
                        letterSpacing: "0.3em", // Espaçamento entre letras
                        textTransform: "uppercase", // Transforma em maiúsculas
                    },
                }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            {placasFiltradas.length === 0 && filtro.trim() && !placaExiste && (
                <div className="space-y-2">
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
                </div>
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
                        {placasFiltradas.map((p, i) => (
                            <TableRow key={i}>
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
        </div>
    );
}
