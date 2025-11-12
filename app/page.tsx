import PlacasTable from "./components/PlacasTable";
import { Container, Typography } from "@mui/material";
import Switch from "./components/switch";
import Image from "next/image";

export default function Home() {
    return (
        <Container
            className="py-8"
            sx={{
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Switch />
            <Image src="/bigwhite.png" width={120} height={120} alt="Logo" />
            <Typography variant="h4" gutterBottom>
                PLACAS-MIND
            </Typography>
            <PlacasTable />
        </Container>
    );
}
