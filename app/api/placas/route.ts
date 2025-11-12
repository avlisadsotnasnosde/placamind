import { NextRequest, NextResponse } from "next/server";
import client from "../../lib/mongodb";

export async function GET() {
    try {
        await client.connect();
        const db = client.db("placamind");
        const collection = db.collection("placamind");
        const data = await collection.find({}).toArray();

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { placa, detalhes } = await req.json();

        if (!placa || !detalhes) {
            return NextResponse.json(
                { error: "Dados incompletos" },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db("placamind");
        const collection = db.collection("placamind");

        const existente = await collection.findOne({ placa });

        if (existente) {
            return NextResponse.json(
                { error: "Placa já cadastrada" },
                { status: 409 }
            );
        }

        const resultado = await collection.insertOne({ placa, detalhes });

        return NextResponse.json(
            {
                message: "Placa cadastrada com sucesso",
                id: resultado.insertedId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { placa } = await req.json();

        if (!placa) {
            return NextResponse.json(
                { error: "Placa não informada" },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db("placamind");
        const collection = db.collection("placamind");

        const resultado = await collection.deleteOne({ placa });

        if (resultado.deletedCount === 0) {
            return NextResponse.json(
                { error: "Placa não encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Placa removida com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao deletar dados:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { placa, detalhes } = await req.json();

        if (!placa || !detalhes) {
            return NextResponse.json(
                { error: "Dados incompletos" },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db("placamind");
        const collection = db.collection("placamind");

        const resultado = await collection.updateOne(
            { placa },
            { $set: { detalhes } }
        );

        if (resultado.matchedCount === 0) {
            return NextResponse.json(
                { error: "Placa não encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Detalhes atualizados com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        );
    }
}
