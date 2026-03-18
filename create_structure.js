const fs = require('fs');
const path = require('path');

const files = [
    'src/app/(site)/page.tsx',
    'src/app/(site)/layout.tsx',
    'src/app/(site)/imoveis/page.tsx',
    'src/app/(site)/imoveis/[slug]/page.tsx',
    'src/app/(site)/blog/page.tsx',
    'src/app/(site)/blog/[slug]/page.tsx',
    'src/app/(site)/contato/page.tsx',
    'src/app/(site)/quem-somos/page.tsx',
    'src/app/(admin)/layout.tsx',
    'src/app/(admin)/admin/page.tsx',
    'src/app/(admin)/admin/imoveis/page.tsx',
    'src/app/(admin)/admin/imoveis/novo/page.tsx',
    'src/app/(admin)/admin/imoveis/[id]/page.tsx',
    'src/app/(admin)/admin/leads/page.tsx',
    'src/app/(admin)/admin/blog/page.tsx',
    'src/app/(admin)/admin/blog/novo/page.tsx',
    'src/app/(admin)/admin/blog/[id]/page.tsx',
    'src/app/(admin)/admin/configuracoes/page.tsx',
    'src/app/api/leads/route.ts',
    'src/app/api/revalidate/route.ts',
    'src/app/not-found.tsx',
    'src/components/site/Header.tsx',
    'src/components/site/Footer.tsx',
    'src/components/site/ImovelCard.tsx',
    'src/components/site/ImovelGaleria.tsx',
    'src/components/site/FiltrosBusca.tsx',
    'src/components/site/BotaoWhatsApp.tsx',
    'src/components/site/FormContato.tsx',
    'src/components/admin/Sidebar.tsx',
    'src/components/admin/ImovelForm.tsx',
    'src/components/admin/UploadFotos.tsx',
    'src/components/admin/LeadsTable.tsx',
    'src/lib/validations/imovel.ts',
    'src/lib/validations/lead.ts',
    'src/lib/utils.ts',
    'src/hooks/useImoveis.ts',
    'src/hooks/useFiltros.ts',
    'src/hooks/useAuth.ts',
    'src/store/filtros.ts',
    'src/types/index.ts',
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    if (!fs.existsSync(fullPath)) {
        if (file.endsWith('.tsx')) {
            const name = path.basename(path.dirname(file));
            const isPage = file.endsWith('page.tsx');
            const isLayout = file.endsWith('layout.tsx');

            if (isPage) {
                fs.writeFileSync(fullPath, `export default function Page() {\n  return <div>${name} page</div>\n}\n`);
            } else if (isLayout) {
                fs.writeFileSync(fullPath, `export default function Layout({ children }: { children: React.ReactNode }) {\n  return <>{children}</>\n}\n`);
            } else {
                const componentName = path.basename(file, '.tsx');
                fs.writeFileSync(fullPath, `export function ${componentName}() {\n  return <div>${componentName}</div>\n}\n`);
            }
        } else {
            fs.writeFileSync(fullPath, `// ${path.basename(file)}\n`);
        }
        console.log(`Created ${file}`);
    }
});
