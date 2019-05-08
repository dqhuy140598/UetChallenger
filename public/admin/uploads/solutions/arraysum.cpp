#include<iostream>
using namespace std;
int main(){
    int N;
    cin>>N;
    int Arr[1000];
    int sum=0;
    for(int i=0;i<N;i++){
        cin>>Arr[i];
        sum+=Arr[i];
    }    
    cout<<sum;
    return 0;
}

