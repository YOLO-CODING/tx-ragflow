import json
import os
import shutil

import requests
from huggingface_hub import snapshot_download


def load_and_modify_json(template_filename, local_filename, modifications):
    if os.path.exists(local_filename):
        data = json.load(open(local_filename))
        config_version = data.get('config_version', '0.0.0')
        if config_version < '1.2.0':
            data = json.load(open(template_filename))
    else:
        data = json.load(open(template_filename))

    # 修改内容
    for key, value in modifications.items():
        data[key] = value

    # 保存修改后的内容
    with open(local_filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def download_model(repo_id, allow_patterns):
    local_dir = os.path.abspath(os.path.join("huggingface.co", repo_id))
    os.makedirs(local_dir, exist_ok=True)
    return snapshot_download(repo_id=repo_id, local_dir=local_dir, allow_patterns=allow_patterns)

if __name__ == '__main__':
    
    mineru_patterns = [
        # "models/Layout/LayoutLMv3/*",
        "models/Layout/YOLO/*",
        "models/MFD/YOLO/*",
        "models/MFR/unimernet_hf_small_2503/*",
        "models/OCR/paddleocr_torch/*",
        "models/TabRec/SlanetPlus/*",
        # "models/TabRec/TableMaster/*",
        # "models/TabRec/StructEqTable/*",
    ]
    model_dir = download_model(repo_id='opendatalab/PDF-Extract-Kit-1.0', allow_patterns=mineru_patterns)

    layoutreader_pattern = [
        "*.json",
        "*.safetensors",
    ]
    layoutreader_model_dir = download_model(repo_id='hantian/layoutreader', allow_patterns=layoutreader_pattern)

    model_dir = model_dir + '/models'
    print(f'model_dir is: {model_dir}')
    print(f'layoutreader_model_dir is: {layoutreader_model_dir}')

    # temp_file_name = os.path.abspath('magic-pdf.template.json')
    # config_file_name = 'magic-pdf.json'
    # config_file = os.path.abspath(config_file_name)
    # json_mods = {
    #     'models-dir': model_dir,
    #     'layoutreader-model-dir': layoutreader_model_dir,
    # }
    # load_and_modify_json(temp_file_name, config_file, json_mods)
    # print(f'The configuration file has been configured successfully, the path is: {config_file}')
