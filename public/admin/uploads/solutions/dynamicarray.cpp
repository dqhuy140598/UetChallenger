#include<iostream>
#include<list>
#include<vector>
using namespace std;
int main() {
    int N;
    int Q;
    cin >> N >> Q;
    vector<vector<int>> Arr;
    Arr.resize(N);
    int lastupdate = 0;
    for (int i = 0; i < Q; i++) {
        int type, x, y;
        cin >> type >> x >> y;
        if (type == 1) {
            int index = (x^lastupdate) % N;
            Arr[index].push_back(y);
        }
        else if (type == 2) {
            lastupdate = Arr[(x^lastupdate) % N][y%Arr[(x^lastupdate)% N].size()];
            cout << lastupdate<<endl;
        }

    }
    return 0;
}
