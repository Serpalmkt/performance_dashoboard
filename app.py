import streamlit as st
import streamlit.components.v1 as components
import os

# --- Configuração da Página (Opcional) ---
# Isso ajuda a usar mais espaço da tela
st.set_page_config(layout="wide")

st.title("Meu Deploy Temporário com Streamlit")
st.write("Abaixo está o conteúdo HTML renderizado:")

# --- Carregar o HTML ---
# Caminho para o seu arquivo index.html
html_file_path = 'caminho/para/seu/index.html'

try:
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Use o components.html para exibir
    # Ajuste 'height' conforme necessário
    components.html(html_content, height=600, scrolling=True)

except FileNotFoundError:
    st.error(f"Arquivo HTML não encontrado em: {html_file_path}")
except Exception as e:
    st.error(f"Ocorreu um erro ao ler o arquivo: {e}")