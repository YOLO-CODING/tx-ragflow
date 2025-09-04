
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

注意： 如果需要本地调试的，请拷贝 ntlk_data 到 $HOME/

2. 脚本 1_,2_,3_为原官方编译步骤，现简化为
	./build.sh - 打包并Push

