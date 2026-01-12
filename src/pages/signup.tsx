import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/Buttons";
import { useNavigate } from "react-router-dom";

// Página de criar conta Purple //
export default function Signup() {
    return (
        <main className="h-screen items-center flex justify-center w-full">
            <section className="flex items-center justify-center h-full w-full p-4">
                <Card className="w-full max-w-lg"> {/* max-w-lg deixa o card maior */}
                    <CardHeader>
                        <CardTitle className="text-2xl text-white font-bold tracking-tighter">
                            Crie uma nova conta
                        </CardTitle>
                        <CardDescription>
                            Adicione todos os seus dados abaixo para começar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Div para criar uma coluna e dar espaçamento entre o texto e o campo */}
                        <div className="flex flex-col gap-2 text-white">

                            {/* Label com estilo básico */}
                            <label htmlFor="nome" className="text-sm font-medium text-white">
                                Digite seu nome completo
                            </label>

                            {/* Use o componente Input (com I maiúsculo) para pegar o estilo pronto */}
                            <Input
                                id="nome"
                                placeholder="seu nome completo"
                                type="nome"
                            />
                            {/* Label com estilo básico */}
                            <label htmlFor="email" className="text-sm font-medium text-white">
                                E-mail
                            </label>

                            {/* Use o componente Input (com I maiúsculo) para pegar o estilo pronto */}
                            <Input
                                id="email"
                                placeholder="exemplo@email.com"
                                type="email"
                            />
                            {/* Label com estilo básico */}
                            <label htmlFor="senha" className="text-sm font-medium text-white">
                                Senha
                            </label>

                            {/* Use o componente Input (com I maiúsculo) para pegar o estilo pronto */}
                            <Input
                                id="senha"
                                placeholder="digite sua senha"
                                type="senha"
                            />
                            {/* Label com estilo básico */}
                            <label htmlFor="confirmar-senha" className="text-sm font-medium text-white">
                                
                            </label>

                            {/* Use o componente Input (com I maiúsculo) para pegar o estilo pronto */}
                            <Input
                                id="confirmar-senha"
                                placeholder="confirme sua senha"
                                type="senha"
                            />
                            {/* Label com estilo básico */}
                            <label htmlFor="empresa" className="text-sm font-medium text-white">
                                Nome da empresa
                            </label>

                            {/* Use o componente Input (com I maiúsculo) para pegar o estilo pronto */}
                            <Input
                                id="empresa"
                                placeholder="digite o nome da sua empresa"
                                type="empresa"
                            />
                            <Button onClick={() => ("/board")} className="bg-purple-600 w-full mt-6">Começar agora</Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}