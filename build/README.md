
一、 编译/打包请看这里

1. 执行 "1_download_deps.sh", 以下载下面资源
huggingface.co/
nltk_data/
chrome-linux64-121-0-6167-85
chromedriver-linux64-121-0-6167-85
cl100k_base.tiktoken
libssl1.1_1.1.1f-1ubuntu2_amd64.deb
libssl1.1_1.1.1f-1ubuntu2_arm64.deb
tika-server-standard-3.0.0.jar
tika-server-standard-3.0.0.jar.md5

2. 脚本 1_,2_,3_为原官方编译步骤，现简化为
	./build.sh - 打包并Push


二、开发调试请看这里
1. 请拷贝 ntlk_data 到 $HOME/
2. 根据 docs/develop/lanuch_ragflow_from_source.md配置开发环境



三、仅部署运行看这里
1. clone整个source代码， 或者仅拷贝docker目录到目的主机
2. 进入docker目录，修改.env 末尾的设置
   
   # Docker-registry

   # 仓库拉取镜像时使用
   DOCKER_REGISTRY_PREFIX=registry.cn-hangzhou.aliyuncs.com/tunan-tb/
   # 本地build时使用
   # DOCKER_REGISTRY_PREFIX=         
   IMAGE_VERSION=latest
   RAGFLOW_IMAGE=${DOCKER_REGISTRY_PREFIX}yolo-ragflow-slim:${IMAGE_VERSION}

3. docker登录阿里云镜像库
    docker login --username=zxy@1836402448034381 registry.cn-hangzhou.aliyuncs.com
    需要密码

 4. docker compose pull

 5. docker compose up -d