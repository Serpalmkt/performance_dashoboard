import streamlit as st
import streamlit.components.v1 as components
import os

st.set_page_config(layout="wide", page_title="Dashboard de Ocorrências")


script_dir = os.path.dirname(os.path.abspath(__file__))

html_file_path = os.path.join(script_dir, 'index.html')
css_file_path = os.path.join(script_dir, 'global.css')
js_file_path = os.path.join(script_dir, 'main.js')

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        st.error(f"Erro: Arquivo não encontrado em: {file_path}")
        return None
    except Exception as e:
        st.error(f"Erro ao ler o arquivo {file_path}: {e}")
        return None

html_content = read_file_content(html_file_path)
css_content = read_file_content(css_file_path)
js_content = read_file_content(js_file_path)
if html_content and css_content and js_content:
    

    css_injection = f"<style>\n{css_content}\n</style>"
    html_content = html_content.replace(
        '<link rel="stylesheet" href="global.css">', 
        css_injection
    )
    
    js_injection = f"<script>\n{js_content}\n</script>"
    html_content = html_content.replace(
        '<script src="main.js"></script>', 
        js_injection
    )
    components.html(html_content, height=800, scrolling=True)

else:
    st.error("Falha ao carregar um ou mais arquivos (HTML, CSS, ou JS). Verifique os logs de erro acima.")