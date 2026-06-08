# Design - Almanaque do Timão

## Visão Geral
Aplicativo mobile para consulta rápida e intuitiva de curiosidades, jogadores, técnicos e fichas técnicas de jogos do Corinthians, baseado no livro "Almanaque do Timão" de Celso Unzelte.

## Telas Principais

### 1. **Home (Exploração)**
- **Conteúdo**: 
  - Seção "Destaques" com curiosidades aleatórias do dia
  - Atalhos rápidos para categorias principais (Jogadores, Técnicos, Jogos, Curiosidades)
  - Histórico recente de buscas/consultas
  - Banner com informação do livro/autor

- **Funcionalidade**:
  - Toque em "Destaques" para ver curiosidade completa
  - Atalhos levam direto para a tela de categoria
  - Limpar histórico

### 2. **Busca (Search)**
- **Conteúdo**:
  - Campo de busca com sugestões em tempo real
  - Filtros por tipo (Jogadores, Técnicos, Jogos, Curiosidades, Datas)
  - Resultados em lista com preview
  - Opção de busca avançada

- **Funcionalidade**:
  - Busca por nome, número, data, período
  - Autocomplete com histórico
  - Toque em resultado abre detalhes

### 3. **Categorias (Tabs)**
- **Jogadores**
  - Lista de todos os 1.042 jogadores
  - Filtro por posição, período, nacionalidade
  - Card com: foto (se disponível), nome, número, posição, período
  
- **Técnicos**
  - Lista dos 91 técnicos
  - Filtro por período, títulos conquistados
  - Card com: nome, período, títulos, estatísticas

- **Jogos**
  - Fichas técnicas dos 4.536 jogos
  - Filtro por período, competição, resultado
  - Card com: data, adversário, resultado, local

- **Curiosidades**
  - Fatos históricos, recordes, marcos
  - Filtro por período, tema
  - Card com: título, resumo, data

### 4. **Detalhes (Jogador/Técnico/Jogo/Curiosidade)**
- **Jogador**:
  - Foto (se disponível)
  - Nome completo, número, posição, nacionalidade
  - Período no clube
  - Estatísticas (jogos, gols, etc.)
  - Curiosidades relacionadas
  - Botão "Compartilhar"

- **Técnico**:
  - Nome, período
  - Títulos conquistados
  - Estatísticas (vitórias, derrotas, empates)
  - Jogos memoráveis
  - Curiosidades

- **Jogo**:
  - Data, local, competição
  - Adversário, resultado, placar
  - Escalação (se disponível)
  - Gols/eventos principais
  - Curiosidades do jogo

- **Curiosidade**:
  - Título, data, categoria
  - Descrição completa
  - Contexto histórico
  - Relacionados

### 5. **Favoritos (Bookmark)**
- Lista de itens salvos (jogadores, curiosidades, jogos)
- Sincronização local com AsyncStorage
- Opção de remover favoritos

### 6. **Configurações**
- Tema (claro/escuro)
- Idioma (português/inglês - futuro)
- Sobre o app
- Sobre o livro/autor
- Feedback

## Fluxos Principais

### Fluxo 1: Explorar Curiosidade
1. Usuário abre o app → Home
2. Vê "Destaques" com curiosidade do dia
3. Toca em "Destaques" → Tela de Detalhes da Curiosidade
4. Lê informação completa
5. Pode compartilhar ou salvar como favorito

### Fluxo 2: Buscar Jogador
1. Usuário toca em "Busca" → Tela de Busca
2. Digita nome do jogador (ex: "Ronaldo")
3. Vê sugestões em tempo real
4. Toca em resultado → Tela de Detalhes do Jogador
5. Vê biografia, estatísticas, curiosidades
6. Pode salvar como favorito

### Fluxo 3: Explorar Categoria
1. Usuário toca em "Jogadores" (tab)
2. Vê lista de todos os jogadores
3. Pode filtrar por posição, período
4. Toca em jogador → Detalhes
5. Volta para lista (back button)

## Escolhas de Design

### Cores (Identidade Corinthians)
- **Primária**: `#000000` (Preto - cor principal do Corinthians)
- **Secundária**: `#FFFFFF` (Branco - cor secundária do Corinthians)
- **Destaque**: `#FF6B35` (Laranja - para CTAs e destaques)
- **Background**: `#F5F5F5` (Cinza claro em modo claro)
- **Background Dark**: `#1A1A1A` (Cinza escuro em modo escuro)
- **Texto**: `#000000` (Preto em modo claro), `#FFFFFF` (Branco em modo escuro)
- **Muted**: `#666666` (Cinza médio para textos secundários)

### Tipografia
- **Título Principal**: 28px, Bold
- **Título Secundário**: 20px, Semibold
- **Corpo**: 16px, Regular
- **Pequeno**: 14px, Regular

### Componentes Principais
- **Card**: Fundo branco/escuro, borda sutil, sombra leve
- **Botão**: Fundo preto, texto branco, canto arredondado (8px)
- **Input**: Borda cinza, placeholder em muted, padding 12px
- **Tab Bar**: Ícones + texto, destaque em laranja
- **Header**: Fundo branco/escuro, título bold, botão de busca

### Interações
- Feedback háptico ao tocar botões
- Transição suave entre telas
- Scroll suave em listas
- Animação de carregamento

## Estrutura de Dados

### Jogador
```
{
  id: string
  nome: string
  numero: number
  posicao: string
  nacionalidade: string
  dataInicio: date
  dataFim: date | null
  foto: string | null
  biografia: string
  estatisticas: {
    jogos: number
    gols: number
    assistencias: number
  }
  curiosidades: string[]
}
```

### Técnico
```
{
  id: string
  nome: string
  dataInicio: date
  dataFim: date | null
  titulos: string[]
  estatisticas: {
    jogos: number
    vitorias: number
    derrotas: number
    empates: number
  }
  curiosidades: string[]
}
```

### Jogo
```
{
  id: string
  data: date
  local: string
  competicao: string
  adversario: string
  placar: {
    corinthians: number
    adversario: number
  }
  escalacao: string[]
  gols: string[]
  curiosidades: string[]
}
```

### Curiosidade
```
{
  id: string
  titulo: string
  descricao: string
  data: date
  categoria: string
  relacionados: string[]
}
```

## Próximos Passos
1. Implementar tela Home com destaques
2. Implementar tela de Busca
3. Implementar categorias (Jogadores, Técnicos, Jogos, Curiosidades)
4. Implementar telas de detalhes
5. Adicionar funcionalidade de favoritos
6. Integrar dados do livro (estruturar conteúdo)
7. Aplicar identidade visual do Corinthians
8. Testes e refinamentos
