import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
// Página de login do site Purple //
export default function Signin() {
    return (
        <main className="h-screen items-center flex justify-center w-full">
            <section className="flex items-center justify-center h-full w-full p-4">
                <Card className="w-full max-w-lg"> {/* max-w-lg deixa o card maior */}
                    <CardHeader>
                        <CardTitle className="text-2xl text-white font-bold tracking-tighter">
                            Entre com sua conta Purple.
                        </CardTitle>
                        <CardDescription>
                            Utilize seu e-mail e senha cadastrados para acessar sua conta Purple.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Div para criar uma coluna e dar espaçamento entre o texto e o campo */}
                        <div className="flex flex-col gap-2">

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
                        </div>
                        <Button className="bg-purple-600 w-full mt-6">Entrar</Button>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}