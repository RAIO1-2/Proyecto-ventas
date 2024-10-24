import { redirect } from 'next/navigation';

export default function Home() {
  // Devuelve la redirección
  return redirect('/products');
}
